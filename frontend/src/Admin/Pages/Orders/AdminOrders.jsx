import React, { useEffect, useState } from "react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/* 🔹 Status colors */
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

/* 🔹 Date formatter */
const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");

      /* 🔥 SORT BY DATE (LATEST FIRST) */
      const sortedOrders = res.data.orders.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setOrders(sortedOrders);
    } catch {
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔹 HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">
          Orders Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Latest orders shown first
        </p>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-5 py-4 text-left">Order ID</th>
                <th className="px-5 py-4 text-left">User</th>
                <th className="px-5 py-4 text-left">Location</th>
                <th className="px-5 py-4 text-left">Budget</th>
                <th className="px-5 py-4 text-left">Created At</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Payment</th>
                <th className="px-5 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`border-b transition hover:bg-[#fff7f3]
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  {/* Order ID */}
                  <td className="px-5 py-4 font-bold text-gray-800">
                    #{order.id}
                  </td>

                  {/* User */}
                  <td className="px-5 py-4">
                    User #{order.user_id ?? "Guest"}
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4">
                    {order.area}, {order.district}
                  </td>

                  {/* Budget */}
                  <td className="px-5 py-4 font-semibold">
                    {order.budget} BDT
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(order.created_at)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize
                        ${statusColor[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize
                        ${paymentColor[order.payment_status]}`}
                    >
                      {order.payment_status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="
                        px-4 py-1.5 rounded-lg
                        text-sm font-semibold
                        text-[#e45716]
                        border border-[#e45716]
                        hover:bg-[#e45716]
                        hover:text-white
                        transition cursor-pointer
                      "
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No orders found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
