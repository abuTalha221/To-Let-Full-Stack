import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import Swal from "sweetalert2";

/* ================= HELPERS ================= */

const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const monthName = (month) =>
  new Date(2025, month - 1).toLocaleString("default", { month: "long" });

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <p className="text-base font-bold text-gray-800">{value}</p>
  </div>
);

/* ================= CONSTANTS ================= */

const statusOptions = ["pending", "processing", "completed", "cancelled"];

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentColor = {
  unpaid: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-orange-100 text-orange-800",
};

/* ================= COMPONENT ================= */

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/admin/orders/${id}?include=transactions`);
      setOrder(res.data.order);
    } catch {
      Swal.fire("Error", "Unable to load order details", "error");
      navigate("/admin/orders");
    }
  };

  const changeStatus = async (status) => {
    if (status === order.status) return;

    const confirm = await Swal.fire({
      title: "Change order status?",
      text: `Set status to "${status}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      confirmButtonColor: "#e45716",
    });

    if (!confirm.isConfirmed) return;

    try {
      setUpdating(true);
      await api.patch(`/admin/orders/${id}/status`, { status });
      Swal.fire("Updated", "Order status updated", "success");
      fetchOrder();
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading order details...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* 🔹 HEADER */}
    <div className="flex items-center justify-end">
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-gray-100 hover:bg-[#e45716]
                    text-gray-700 hover:text-white
                    text-sm font-semibold transition cursor-pointer"
        >
            ← Back to Orders
        </button>
    </div>


      {/* 🔹 ORDER SUMMARY (LIKE USER VIEW) */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-extrabold text-[#e45716]">
          Order #{order.id}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Created : {formatDate(order.created_at)}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span
            className={`px-3 py-1 text-sm font-bold rounded-full ${statusColor[order.status]}`}
          >
            Status : {order.status}
          </span>

          <span
            className={`px-3 py-1 text-sm font-bold rounded-full ${paymentColor[order.payment_status]}`}
          >
            Payment : {order.payment_status}
          </span>
        </div>
      </div>

      {/* 🔹 USER INFORMATION */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">User Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><b>Name:</b> {order.user?.name || "Guest"}</p>
          <p><b>Email:</b> {order.user?.email || "N/A"}</p>
          <p><b>Phone:</b> {order.contact_phone}</p>
        </div>
      </div>

      {/* 🔹 PROPERTY DETAILS */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Property Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Info label="Division" value={order.division} />
          <Info label="District" value={order.district} />
          <Info label="Area" value={order.area} />
          <Info label="Sub Area" value={order.subarea || "N/A"} />
          <Info label="Category" value={order.category} />
          <Info label="Room" value={order.room} />
          <Info label="Need From" value={monthName(order.move_in_month)} />
          <Info label="Budget" value={`${order.budget} BDT`} />
        </div>
      </div>

      {/* 🔹 REQUIREMENT DETAILS */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-3">Details Requirement</h3>
        <p className="text-gray-700 leading-relaxed">
          {order.details || "No additional requirements provided."}
        </p>
      </div>

      {/* 🔹 PAYMENT INFORMATION */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Payment Information</h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p>
            <b>Status:</b>{" "}
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentColor[order.payment_status]}`}>
              {order.payment_status}
            </span>
          </p>
          <p><b>Amount:</b> {order.cost} BDT</p>
          <p>
            <b>Method:</b> {order.payment_status === "paid" && order.transactions?.length > 0 
              ? order.transactions[0]?.payment_gateway || "N/A" 
              : (order.payment_status === "paid" ? "N/A" : "Not paid yet")}
          </p>
          <p>
            <b>Transaction ID:</b> {order.payment_status === "paid" && order.transactions?.length > 0 
              ? order.transactions[0]?.transaction_id || "N/A" 
              : "N/A"}
          </p>
        </div>
      </div>

      {/* 🔹 STATUS MANAGEMENT (ADMIN ONLY) */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Change Order Status</h3>

        <div className="flex flex-wrap gap-3">
          {statusOptions.map((status) => (
            <button
              key={status}
              disabled={updating}
              onClick={() => changeStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize
                ${
                  order.status === status
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#e45716] text-white hover:bg-[#d35f25]"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
