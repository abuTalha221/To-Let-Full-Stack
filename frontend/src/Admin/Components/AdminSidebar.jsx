import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api";
import logo from "../../assets/logo.png";
import {
  MdDashboard,
  MdPeople,
  MdHomeWork,
  MdShoppingCart,
  MdLocationOn,
  MdAssessment,
  MdSettings,
  MdLogout,
  MdPayment,
} from "react-icons/md";

const menu = [
  {
    section: "MAIN",
    items: [
      {
        id: 1,
        name: "Dashboard",
        link: "/admin/dashboard",
        icon: <MdDashboard />,
      },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      {
        id: 2,
        name: "Users",
        link: "/admin/manage-users",
        icon: <MdPeople />,
      },
      {
        id: 3,
        name: "Properties",
        link: "/admin/properties",
        icon: <MdHomeWork />,
      },
      {
        id: 4,
        name: "Orders",
        link: "/admin/orders",
        icon: <MdShoppingCart />,
      },
      {
        id: 5,
        name: "Payments",
        link: "/admin/payments",
        icon: <MdPayment />,
      }, 
    ],
  },
  {
    section: "REPORTS",
    items: [
      {
        id: 7,
        name: "Reports",
        link: "/admin/reports",
        icon: <MdAssessment />,
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        id: 8,
        name: "Settings",
        link: "/admin/settings",
        icon: <MdSettings />,
      },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  // 🔴 LOGOUT HANDLER
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout?",
      text: "You will be logged out from admin panel",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      confirmButtonColor: "#e45716",
      cancelButtonColor: "#9ca3af",
    });

    if (!confirm.isConfirmed) return;

    try {
      // 🔐 Backend logout
      await api.post("/admin/logout");

      // 🧹 Clear admin data
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin");

      // 🔒 Remove auth header
      delete api.defaults.headers.common.Authorization;

      // ✅ Success message
      await Swal.fire({
        icon: "success",
        title: "Logged Out 👋",
        text: "Logout successful",
        confirmButtonColor: "#e45716",
      });

      // 🔁 Redirect to login
      navigate("/admin");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-xl flex flex-col">
      {/* LOGO */}
      <div className="py-6 flex justify-center">
        <img src={logo} alt="ToLet Logo" className="h-12 object-contain" />
      </div>

      {/* ADMIN INFO */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-extrabold tracking-wide text-[#e45716]">
          ToLet Admin
        </h3>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mt-1">
          Control Panel
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {menu.map((group, index) => (
          <div key={index} className="mb-6">
            <p className="text-xs text-gray-400 font-semibold mb-2 px-2">
              {group.section}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-[#e45716] text-white shadow-md"
                        : "text-gray-700 hover:bg-[#fff1ea] hover:text-[#e45716]"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <MdLogout className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
