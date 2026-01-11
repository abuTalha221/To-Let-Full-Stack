import React from "react";
import { FaTimes, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

const OrderPaymentModal = ({ order, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Order Payment",
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Location:</strong> ${order.area}, ${order.district}</p>
          <p><strong>Budget:</strong> ${order.budget} BDT</p>
          <p><strong>Room Type:</strong> ${order.room} Room</p>
          <p><strong>Category:</strong> ${order.category}</p>
          <hr />
          <p style="color: #EC733B; font-weight: bold;">You will be redirected to the payment gateway.</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e45716",
    });

    if (confirm.isConfirmed) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Order Payment</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold text-[#EC733B]">
              #{order.id}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Location:</span>
            <span className="font-semibold text-gray-800 text-sm">
              {order.area}, {order.district}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Room Type:</span>
            <span className="font-semibold text-gray-800">
              {order.room} Room
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Category:</span>
            <span className="font-semibold text-gray-800 capitalize">
              {order.category}
            </span>
          </div>

          <hr className="border-gray-300" />

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Amount:</span>
            <span className="text-2xl font-bold text-[#EC733B]">
              {order.cost || order.budget} BDT
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-700">
            ✓ After successful payment, you can download the invoice from the
            orders page.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-[#EC733B] hover:bg-[#d9612c] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentModal;
