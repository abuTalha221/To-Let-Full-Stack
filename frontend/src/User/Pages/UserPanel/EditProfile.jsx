import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserNavbar from "../../Components/UserNavbar";

const EditProfile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show / Hide password states
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        confirmButtonColor: "#EC733B",
      });
    }

    try {
      await api.post("/user/change-password", {
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Updated!",
        text: "Your password has been changed successfully.",
        confirmButtonColor: "#EC733B",
      });

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update password",
        text: error.response?.data?.message || "Please try again!",
      });
      console.error(error);
    }
  };

  return (
    <>
      {/* ✅ Navbar on top */}
      <UserNavbar hideSidebarToggle={true} />


      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-600 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC733B]"
                  required
                />

                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowNewPass(!showNewPass)}
                >
                  {showNewPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-600 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC733B]"
                  required
                />

                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#EC733B] text-white py-2 rounded-lg hover:bg-[#d9612c] transition cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
