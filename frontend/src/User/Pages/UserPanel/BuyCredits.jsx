import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../../api";
import PaymentInvoiceModal from "./PaymentInvoiceModal";

const packages = [
  { id: 1, name: "Starter Package", credits: 100, price: 100 },
  { id: 2, name: "Basic Package", credits: 220, price: 200 },
  { id: 3, name: "Exclusive Package", credits: 550, price: 500 },
];

const BuyCredits = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Handle payment callback status on page load
  useEffect(() => {
    const status = searchParams.get("payment_status");
    const message = searchParams.get("message");

    // Decode message if it's URL encoded
    const decodedMessage = message ? decodeURIComponent(message) : null;

    if (status === "success") {
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: decodedMessage || "Credits have been added to your account",
        confirmButtonColor: "#e45716",
        didClose: () => {
          // Clean up URL after alert is closed
          navigate("/user/credits", { replace: true });
        }
      });
    } else if (status === "failed") {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: decodedMessage || "Your payment could not be processed",
        confirmButtonColor: "#e45716",
        didClose: () => {
          // Clean up URL after alert is closed
          navigate("/user/credits", { replace: true });
        }
      });
    } else if (status === "cancelled") {
      Swal.fire({
        icon: "warning",
        title: "Payment Cancelled",
        text: decodedMessage || "You have cancelled the payment",
        confirmButtonColor: "#e45716",
        didClose: () => {
          // Clean up URL after alert is closed
          navigate("/user/credits", { replace: true });
        }
      });
    }
  }, [searchParams, navigate]);

  const handleBuy = (pkg) => {
    setSelectedPackage(pkg);
    setShowInvoiceModal(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage) return;

    try {
      setLoadingId(selectedPackage.id);

      Swal.fire({
        title: "Processing payment...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // ✅ Payload sent to backend
      const payload = {
        package_name: selectedPackage.name,
        credits: selectedPackage.credits,
        amount: Number(selectedPackage.price),
      };

      // ✅ API call
      const res = await api.post("/initiate-ssl-payment", payload);

      Swal.close();

      const data = res?.data || {};

      // ✅ LOG FULL SSL RESPONSE
      console.log("SSLCommerz Response:", data);

      // ✅ Get gateway URL
      const gateway =
        data.GatewayPageURL ||
        data.gateway_url ||
        data.gateway_redirect ||
        data.redirect_url ||
        null;

      // ❌ If no gateway URL, show real error
      if (!gateway) {
        throw new Error(
          data?.failedreason ||
          data?.message ||
          "No gateway URL returned"
        );
      }

      // ✅ Redirect to SSLCommerz (same window, not new tab)
      window.location.href = gateway;

    } catch (err) {
      Swal.close();

      console.error("Payment Error:", err);

      const detail =
        err?.response?.data?.message ||
        err?.message ||
        "Payment initiation failed";

      await Swal.fire({
        icon: "error",
        title: "Payment initiation failed",
        text: detail,
        confirmButtonColor: "#e45716",
      });

      setLoadingId(null);
      setShowInvoiceModal(false);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Buy Credits
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            style={{ animationDelay: `${index * 80}ms` }}
            className="
              group bg-[#f8f6f6] rounded-2xl p-8 flex flex-col items-center
              shadow-lg hover:shadow-2xl hover:-translate-y-2
              transition-all duration-300
            "
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {pkg.name}
            </h2>

            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FaCheckCircle className="text-green-500 text-lg" />
              <span>{pkg.credits} Credits</span>
            </div>

            <p className="text-3xl font-bold text-[#EC733B] my-4">
              {pkg.price} BDT
            </p>

            <button
              onClick={() => handleBuy(pkg)}
              disabled={loadingId === pkg.id}
              className={`
                w-full py-2.5 rounded-xl font-semibold text-white
                bg-[#EC733B] hover:bg-[#d9612c]
                transition
                ${
                  loadingId === pkg.id
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {loadingId === pkg.id ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Invoice Modal */}
      <PaymentInvoiceModal
        pkg={selectedPackage}
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedPackage(null);
          setLoadingId(null);
        }}
        onConfirm={handleProceedToPayment}
        isLoading={loadingId !== null}
      />
    </div>
  );
};

export default BuyCredits;
