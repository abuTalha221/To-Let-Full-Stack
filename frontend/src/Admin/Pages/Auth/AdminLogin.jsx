import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter email and password",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/admin/login", form);

      // ✅ Store admin token separately
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      // ✅ Set authorization header
      api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;

      await Swal.fire({
        icon: "success",
        title: "Welcome Admin 👋",
        text: "Login successful",
        confirmButtonColor: "#e45716",
      });

      // ✅ Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Admin Login
        </h2>

        <p className="text-center text-sm text-gray-500 mt-2">
          Only authorized admins can access
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="admin@gmail.com"
            />
          </div>

          {/* Password with Eye */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] text-white py-2 rounded-full font-medium hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} To Let Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
