import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import Swal from "sweetalert2";

/*  Date formatter */
const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

/*  Status colors */
const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

/*  Payment colors */
const paymentColor = {
  unpaid: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-orange-100 text-orange-800",
};

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/my-orders/${id}`);
      setOrder(res.data.order);
    } catch {
      Swal.fire("Error", "Unable to load order details", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading order details...
      </p>
    );
  }

  if (!order) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/*  HEADER */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-extrabold text-[#e45716]">
          Order #{order.id}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Created : {formatDate(order.created_at)}
        </p>

        {/*  STATUS BADGES */}
        <div className="mt-4 flex flex-wrap gap-3">
          <span
            className={`px-3 py-1 text-sm font-bold rounded-full capitalize ${
              statusColor[order.status]
            }`}
          >
            Status : {order.status}
          </span>

          <span
            className={`px-3 py-1 text-sm font-bold rounded-full capitalize ${
              paymentColor[order.payment_status]
            }`}
          >
            Payment : {order.payment_status}
          </span>
        </div>
      </div>

      {/*  PROPERTY DETAILS */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Property Details
        </h3>

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

      {/*  REQUIREMENT DETAILS */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Details Requirement
        </h3>

        <p className="text-gray-700 leading-relaxed">
          {order.details || "No additional requirements provided."}
        </p>
      </div>
    </div>
  );
};

/*  Small reusable component */
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500">{label}</p>
    <p className="text-base font-bold text-gray-800">{value}</p>
  </div>
);

/*  Month helper */
const monthName = (month) =>
  new Date(new Date().getFullYear(), month - 1).toLocaleString("default", { month: "long" });

export default ViewOrder;
