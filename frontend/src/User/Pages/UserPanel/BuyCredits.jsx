import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../../api";

const packages = [
  { id: 1, name: "Starter Package", credits: 100, price: 100 },
  { id: 2, name: "Basic Package", credits: 220, price: 200 },
  { id: 3, name: "Exclusive Package", credits: 550, price: 500 },
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
      };

      const res = await api.post("/initiate-ssl-payment", payload);

      Swal.close();

      if (res?.data?.GatewayPageURL) {
        window.location.href = res.data.GatewayPageURL;
        return;
      }

      throw new Error("No GatewayPageURL returned");
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "Payment initiation failed", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-10">
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
              shadow-lg
              hover:shadow-2xl hover:-translate-y-2
              transition-all duration-300 ease-out
              animate-fadeIn
            "
          >
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#EC733B] transition">
              {pkg.name}
            </h2>

            {/* Credits */}
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FaCheckCircle className="text-green-500 text-lg" />
              <span className="font-medium">
                {pkg.credits} Credits
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-[#EC733B] my-4">
              {pkg.price} BDT
            </p>

            {/* Button */}
            <button
              onClick={() => handleBuy(pkg)}
              disabled={loadingId === pkg.id}
              className={`
                w-full py-2.5 rounded-xl font-semibold text-white
                bg-[#EC733B] hover:bg-[#d9612c]
                transition-all duration-300 cursor-pointer
                ${
                  loadingId === pkg.id
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }
              `}
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
