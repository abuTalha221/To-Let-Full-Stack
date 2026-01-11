import React, { useEffect, useState } from "react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";
import OrderPaymentModal from "./OrderPaymentModal";
import Invoice from "./Invoice";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Handle payment callback
  useEffect(() => {
    const status = searchParams.get("payment_status");
    const message = searchParams.get("message");

    if (status) {
      const decodedMessage = message ? decodeURIComponent(message) : null;

      if (status === "success") {
        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: decodedMessage || "Order payment completed",
          confirmButtonColor: "#e45716",
          didClose: () => {
            navigate("/user/orders", { replace: true });
            fetchOrders(); // Refresh orders
          }
        });
      } else if (status === "failed") {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: decodedMessage || "Your payment could not be processed",
          confirmButtonColor: "#e45716",
          didClose: () => {
            navigate("/user/orders", { replace: true });
          }
        });
      }
    }
  }, [searchParams, navigate]);

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

  const handlePayNow = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedOrder) return;

    try {
      setPaymentLoading(true);

      Swal.fire({
        title: "Processing payment...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // ✅ API call to initiate order payment
      const res = await api.post("/initiate-order-payment", {
        order_id: selectedOrder.id,
      });

      Swal.close();

      const data = res?.data || {};

      console.log("SSLCommerz Response:", data);

      // ✅ Get gateway URL
      const gateway =
        data.GatewayPageURL ||
        data.gateway_url ||
        data.gateway_redirect ||
        data.redirect_url ||
        null;

      if (!gateway) {
        throw new Error(
          data?.failedreason ||
          data?.message ||
          "No gateway URL returned"
        );
      }

      // ✅ Redirect to payment gateway
      window.location.href = gateway;
    } catch (err) {
      Swal.close();

      console.error("Payment Error:", err);

      const detail =
        err?.response?.data?.message ||
        err?.message ||
        "Payment initiation failed";

      Swal.fire({
        icon: "error",
        title: "Payment initiation failed",
        text: detail,
        confirmButtonColor: "#e45716",
      });

      setPaymentLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleViewInvoice = async (order) => {
    try {
      setLoading(true);
      // Fetch fresh order details (includes transactions)
      const res = await api.get(`/my-orders/${order.id}`);
      const fullOrder = res.data.order;
      setSelectedOrder(fullOrder);
      setShowInvoice(true);
    } catch (err) {
      Swal.fire('Error', 'Failed to load invoice', 'error');
    } finally {
      setLoading(false);
    }
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
                    Budget : {order.budget} BDT · Payable: {order.cost || order.budget} BDT
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
                      onClick={() => handlePayNow(order)}
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
                    onClick={() => handleViewInvoice(order)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <FaEye />
                    View Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Order Payment Modal */}
      <OrderPaymentModal
        order={selectedOrder}
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedOrder(null);
          setPaymentLoading(false);
        }}
        onConfirm={handleProceedToPayment}
        isLoading={paymentLoading}
      />

      {/* ✅ Invoice Modal */}
      <Invoice
        order={selectedOrder}
        isOpen={showInvoice}
        onClose={() => {
          setShowInvoice(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default MyOrders;
