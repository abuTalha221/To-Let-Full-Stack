import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../../api"; // axios instance

const packages = [
  { id: 1, name: "Starter Package", credits: 100, price: 100 },
  { id: 2, name: "Basic Package", credits: 220, price: 200 },
  { id: 3, name: "Exclusive Package", credits: 550, price: 500 },
  { id: 4, name: "Bronze Package", credits: 1150, price: 1000 },
  { id: 5, name: "Silver Package", credits: 2400, price: 2000 },
  { id: 6, name: "Golden Package", credits: 6250, price: 5000 },
  { id: 7, name: "Platinum Package", credits: 13000, price: 10000 },
];

const BuyCredits = () => {
  const [loadingId, setLoadingId] = useState(null);

  const handleBuy = async (pkg) => {
    const confirm = await Swal.fire({
      title: `Buy ${pkg.name}?`,
      text: `${pkg.credits} credits — ${pkg.price} BDT`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Proceed to Pay",
      confirmButtonColor: "#e45716",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoadingId(pkg.id);

      Swal.fire({
        title: "Redirecting to payment gateway...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        package_name: pkg.name,
        product_name: pkg.name,
        product_category: "Credits",
        product_profile: "non-physical",
        credits: pkg.credits,
        amount: Number(pkg.price),
        cus_phone: localStorage.getItem("user_phone") || undefined,
      };

      const res = await api.post("/initiate-ssl-payment", payload);

      Swal.close();

      // 🔥 DIRECT — Always prefer SSLCommerz URL (no ngrok splash)
      if (res?.data?.GatewayPageURL) {
        window.location.href = res.data.GatewayPageURL;
        return;
      }

      throw new Error("No GatewayPageURL returned by backend");
    } catch (err) {
      Swal.close();
      console.error("BuyCredits error:", err);

      const serverData = err?.response?.data;
      const errorText =
        serverData ? JSON.stringify(serverData, null, 2) : err.message;

      Swal.fire({
        icon: "error",
        title: "Payment initiation failed",
        html: `<pre style="text-align:left; white-space:pre-wrap;">${errorText}</pre>`,
        confirmButtonColor: "#e45716",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Packages
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center border hover:shadow-xl hover:scale-[1.02] transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {pkg.name}
            </h2>

            <p className="text-lg text-gray-600 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              {pkg.credits} Credits
            </p>

            <p className="text-2xl font-bold text-[#EC733B] mt-3 mb-6">
              {pkg.price} BDT
            </p>

            <button
              onClick={() => handleBuy(pkg)}
              disabled={loadingId === pkg.id}
              className={`bg-[#EC733B] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#d9612c] transition ${
                loadingId === pkg.id ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loadingId === pkg.id ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredits;
