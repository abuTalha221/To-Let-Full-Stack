import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // ✅ Register API
      const res = await api.post("/register", form);

      // ✅ SAVE REQUIRED DATA FOR OTP PAGE
      localStorage.setItem("verify_user_id", res.data.user_id);
      localStorage.setItem("verify_email", form.email);

      await Swal.fire({
        icon: "success",
        title: "OTP Sent 📩",
        text: "A 6-digit OTP has been sent to your email. Please verify it.",
        confirmButtonColor: "#e45716",
      });

      // ✅ Redirect to OTP verification page
      navigate("/verify-otp");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.response?.data?.message || "Something went wrong",
          confirmButtonColor: "#e45716",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-center text-4xl font-bold text-gray-800">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-600 mt-2">
          Register with your email to get started
        </p>

        <form className="space-y-5 mt-6" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password[0]}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={form.password_confirmation}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] text-white py-2 rounded-full hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#e45716] font-medium">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
