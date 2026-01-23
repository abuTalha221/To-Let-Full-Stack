import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user was blocked while using the app
  React.useEffect(() => {
    const blockedFlag = localStorage.getItem("userBlocked");
    if (blockedFlag) {
      Swal.fire({
        icon: "warning",
        title: "Account Blocked",
        html: `<div class="text-left">
          <p class="mb-3">Your account has been blocked by the ToLet team.</p>
          <p class="text-sm text-gray-600">If you believe this is a mistake, please contact our support team at <strong>support@tolet.com</strong></p>
        </div>`,
        confirmButtonColor: "#e45716",
      });
      localStorage.removeItem("userBlocked");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", form);
      const { token, user } = res.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${user.name}!`,
        confirmButtonColor: "#e45716",
      });

      navigate("/user-panel");
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

        } else if (status === 403 && data.blocked) {
          // Account is blocked
          Swal.fire({
            icon: "warning",
            title: "Account Blocked",
            html: `<div class="text-left">
              <p class="mb-3">${data.message}</p>
              <p class="text-sm text-gray-600">If you believe this is a mistake, please contact our support team.</p>
            </div>`,
            confirmButtonColor: "#e45716",
          });

        } else if (status === 401) {
          Swal.fire({
            icon: "error",
            title: "Incorrect Password",
            text: "The password you entered is incorrect. Please try again.",
            confirmButtonColor: "#e45716",
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              {/* Eye Button — same as EditProfile */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            {/* Forgot Password Link */}
            <div className="mt-2 text-right">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-[#e45716] hover:text-[#EC733B]"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full cursor-pointer disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-[#e45716] hover:text-[#EC733B]">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
