import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/forgot-password", { email });
      
      setUserId(res.data.user_id);
      setStep(2);

      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "Please check your email for the OTP code.",
        confirmButtonColor: "#e45716",
      });
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 404) {
          const result = await Swal.fire({
            title: "No Account Found",
            text: "This email is not registered. Would you like to create an account?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Go to Register",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#e45716",
          });
          if (result.isConfirmed) navigate("/register");

        } else if (status === 429) {
          Swal.fire({
            icon: "warning",
            title: "Too Many Requests",
            text: "Please wait a moment before requesting another OTP.",
            confirmButtonColor: "#e45716",
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Something went wrong. Please try again.",
            confirmButtonColor: "#e45716",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Network Error!",
          text: "Unable to connect to the server. Please try again later.",
          confirmButtonColor: "#e45716",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/reset-password", {
        user_id: userId,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      });

      await Swal.fire({
        icon: "success",
        title: "Password Reset Successfully!",
        text: "You can now login with your new password.",
        confirmButtonColor: "#e45716",
      });

      navigate("/login");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          if (data.message.includes("OTP expired")) {
            Swal.fire({
              icon: "error",
              title: "OTP Expired",
              text: "The OTP has expired. Please request a new one.",
              confirmButtonColor: "#e45716",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Invalid OTP",
              text: "The OTP you entered is incorrect. Please try again.",
              confirmButtonColor: "#e45716",
            });
          }

        } else if (status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: errorMessages,
            confirmButtonColor: "#e45716",
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Something went wrong. Please try again.",
            confirmButtonColor: "#e45716",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Network Error!",
          text: "Unable to connect to the server. Please try again later.",
          confirmButtonColor: "#e45716",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-5">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-8">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-800">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1
              ? "Enter your email to receive an OTP code"
              : "Enter the OTP and your new password"}
          </p>
        </div>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Send OTP Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full cursor-pointer disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>

            {/* Back to Login */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <a href="/login" className="font-medium text-[#e45716] hover:text-[#EC733B]">
                Back to Login
              </a>
            </p>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {/* OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                name="otp"
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="Enter 6-digit OTP"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters with uppercase, lowercase, numbers, and symbols
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>
            </div>

            {/* Reset Password Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full cursor-pointer disabled:opacity-60"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>

            {/* Resend OTP */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the OTP?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setPassword("");
                  setPasswordConfirmation("");
                }}
                className="font-medium text-[#e45716] hover:text-[#EC733B]"
              >
                Resend OTP
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
