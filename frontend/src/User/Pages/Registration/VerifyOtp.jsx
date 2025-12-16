import React, { useEffect, useState } from "react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const OTP_EXPIRY_TIME = 600;      // 10 minutes (OTP validity)
const RESEND_COOLDOWN = 60;       // 60 seconds (resend limit)

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [otpTimeLeft, setOtpTimeLeft] = useState(OTP_EXPIRY_TIME);
  const [resendTimeLeft, setResendTimeLeft] = useState(RESEND_COOLDOWN);

  const navigate = useNavigate();

  const userId = localStorage.getItem("verify_user_id");
  const email = localStorage.getItem("verify_email");

  /* =============================
     ⏳ OTP EXPIRY TIMER
  ============================= */
  useEffect(() => {
    if (otpTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setOtpTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpTimeLeft]);

  /* =============================
     🔁 RESEND COOLDOWN TIMER
  ============================= */
  useEffect(() => {
    if (resendTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setResendTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimeLeft]);

  /* =============================
     ✅ VERIFY OTP
  ============================= */
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please register again.",
      });
      navigate("/register");
      return;
    }

    if (otp.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "OTP must be 6 digits.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/verify-otp", {
        user_id: userId,
        otp,
      });

      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;

      localStorage.removeItem("verify_user_id");
      localStorage.removeItem("verify_email");

      await Swal.fire({
        icon: "success",
        title: "Email Verified 🎉",
        text: "Registration successful. Welcome to To Let!",
        confirmButtonColor: "#e45716",
      });

      navigate("/user-panel");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.response?.data?.message || "Invalid or expired OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     🔁 RESEND OTP
  ============================= */
  const handleResend = async () => {
    if (!userId || resendTimeLeft > 0) return;

    setResending(true);

    try {
      await api.post("/resend-otp", { user_id: userId });

      setOtp("");
      setOtpTimeLeft(OTP_EXPIRY_TIME);
      setResendTimeLeft(RESEND_COOLDOWN);

      Swal.fire({
        icon: "success",
        title: "OTP Resent 📩",
        text: "A new OTP has been sent to your email.",
        confirmButtonColor: "#e45716",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Please Wait",
        text: err.response?.data?.message || "Try again later.",
      });
    } finally {
      setResending(false);
    }
  };

  /* =============================
     ⏱ FORMAT TIME
  ============================= */
  const otpMinutes = Math.floor(otpTimeLeft / 60);
  const otpSeconds = String(otpTimeLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Verify Email
        </h2>

        <p className="text-center text-sm text-gray-600 mt-2">
          Enter the 6-digit OTP sent to
        </p>

        <p className="text-center font-semibold text-gray-800 mt-1">
          {email}
        </p>

        {/* OTP FORM */}
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <input
            type="text"
            maxLength="6"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="● ● ● ● ● ●"
            className="w-full border rounded-md px-4 py-3 text-center text-2xl tracking-[0.6em]"
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] text-white py-2 rounded-full hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* OTP TIMER */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {otpTimeLeft > 0 ? (
            <>
              OTP expires in{" "}
              <span className="font-semibold text-gray-800">
                {otpMinutes}:{otpSeconds}
              </span>
            </>
          ) : (
            <span className="text-red-600">OTP expired</span>
          )}
        </div>

        {/* RESEND BUTTON */}
        <button
          onClick={handleResend}
          disabled={resendTimeLeft > 0 || resending}
          className={`mt-4 w-full py-2 rounded-full transition
            ${
              resendTimeLeft > 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#EC733B] text-white hover:bg-[#e45716]"
            }`}
        >
          {resending
            ? "Resending..."
            : resendTimeLeft > 0
            ? `Resend in ${resendTimeLeft}s`
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
