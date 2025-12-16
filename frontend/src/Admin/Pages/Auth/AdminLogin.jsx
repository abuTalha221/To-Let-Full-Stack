import React, { useState } from "react";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

    // ⚠️ Backend will be added later
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        icon: "info",
        title: "Admin Login",
        text: "Backend not connected yet",
      });
    }, 1000);
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
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="••••••••"
            />
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
