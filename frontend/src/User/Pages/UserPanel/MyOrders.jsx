import React, { useEffect, useState } from "react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const paymentColor = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
  failed: "bg-orange-100 text-orange-800",
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/my-orders");
      setOrders(res.data.orders);
    } catch {
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (orderId) => {
    Swal.fire({
      title: "Proceed to Payment?",
      text: "You will be redirected to payment page.",
      icon: "info",
      confirmButtonText: "Pay Now",
      showCancelButton: true,
      confirmButtonColor: "#e45716",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/payment-processing?order_id=${orderId}`);
      }
    });
  };

  const handleViewOrder = (orderId) => {
    navigate(`/user/orders/${orderId}`);
  };

  const handleCreateOrder = () => {
    navigate("/order-property");
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading your orders...
      </p>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">
          My Orders
        </h2>

        <button
          onClick={handleCreateOrder}
          className="flex items-center gap-2 bg-[#e45716] hover:bg-[#d35f25] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <FaPlus className="text-sm" />
          Create Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          You haven’t placed any orders yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order ID
                  </p>
                  <h3 className="text-xl font-extrabold text-[#e45716] tracking-wide">
                    {order.id}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              {/* INFO */}
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {order.area}, {order.district}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.subarea || "Dhaka"}
                  </p>
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {order.room} Room for {order.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    From :{" "}
                    {new Date(
                      2025,
                      order.move_in_month - 1
                    ).toLocaleString("default", { month: "long" })}
                  </p>
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-800">
                    Budget : {order.budget} BDT
                  </p>
                  <p className="text-sm text-gray-500">
                    Created : {formatDate(order.created_at)}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${paymentColor[order.payment_status]}`}
                >
                  {order.payment_status}
                </span>

                <div className="flex gap-2">
                  {order.payment_status !== "paid" && (
                    <button
                      onClick={() => handlePayNow(order.id)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition cursor-pointer
                        ${
                          order.payment_status === "failed"
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "bg-[#e45716] hover:bg-[#d35f25] text-white"
                        }`}
                    >
                      {order.payment_status === "failed"
                        ? "Retry Payment"
                        : "Pay Now"}
                    </button>
                  )}

                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <FaEye />
                    View Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
