import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Logo from "../../assets/logo.png";

const UserNavbar = ({ sidebarOpen = false, setSidebarOpen = () => {}, hideSidebarToggle = false }) => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        e.target.id !== "user-icon"
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#e45716",
    });

    if (!confirm.isConfirmed) return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    await Swal.fire({
      icon: "success",
      title: "Logged Out",
      confirmButtonColor: "#e45716",
    });

    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 w-full z-20">
        {/* LEFT AREA */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Sidebar Toggle */}
          {!hideSidebarToggle && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-[#EC733B] text-white p-2 rounded-full shadow hover:bg-[#d9612c] transition"
            >
              {sidebarOpen ? (
                <FaAngleLeft className="text-lg" />
              ) : (
                <FaAngleRight className="text-lg" />
              )}
            </button>
          )}

          {/* Logo */}
          <img
            src={Logo}
            alt="Logo"
            onClick={() => navigate("/")}
            className="h-7 sm:h-7 w-auto cursor-pointer select-none"
          />
        </div>

        {/* RIGHT AREA */}
        <div className="flex items-center gap-4 sm:gap-6 relative">
          {/* Notification Bell */}
          <FaBell className="text-xl sm:text-2xl text-gray-700 cursor-pointer hover:text-[#EC733B] transition" />

          {/* Profile Icon */}
          <button
            id="user-icon"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="relative flex items-center"
          >
            <FaUserCircle className="text-2xl sm:text-3xl text-gray-700 hover:text-[#EC733B] transition cursor-pointer" />
          </button>
        </div>
      </header>

      {/* DROPDOWN MENU */}
      <div
        ref={dropdownRef}
        className={`absolute right-3 sm:right-6 top-[70px] sm:top-[78px] w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden transition-all duration-300 transform ${
          profileMenuOpen
            ? "opacity-100 scale-100 max-h-44"
            : "opacity-0 scale-95 max-h-0 pointer-events-none"
        }`}
      >
      

        {/* Profile */}
        <button
          onClick={() => {
            setProfileMenuOpen(false);
            navigate("/user/edit-profile");
          }}
          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition"
        >
          <FaUserCircle /> Profile
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-gray-100 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
};

export default UserNavbar;
