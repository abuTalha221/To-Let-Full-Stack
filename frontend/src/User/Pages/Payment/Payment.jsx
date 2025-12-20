import React from "react";
import { useParams } from "react-router-dom";

const Payment = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#EC733B] mb-4">
          Complete Payment
        </h2>

        <p className="text-gray-700 mb-2">
          Order ID: <strong>{orderId}</strong>
        </p>

        <p className="text-gray-700 mb-6">
          Payment Status: <span className="text-red-600 font-semibold">Unpaid</span>
        </p>

        <button
          className="w-full bg-[#EC733B] hover:bg-[#d35f25] text-white font-semibold py-3 rounded-lg transition cursor-pointer"
        >
          Pay Now (SSLCommerz)
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          You will be redirected to a secure payment gateway
        </p>
      </div>
    </div>
  );
};

export default Payment;
