import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaAngleDown,
  FaAngleUp,
  FaAngleRight,
  FaShoppingCart,
  FaTags,
  FaHeart,
  FaLockOpen,
} from "react-icons/fa";

const UserSidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate();

  const [openOrders, setOpenOrders] = useState(true);
  const [openProperties, setOpenProperties] = useState(true);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-60" : "w-20"
      } bg-white shadow-lg p-5 flex flex-col transition-all duration-300 overflow-y-auto h-screen`}
    >
      <nav className="flex flex-col gap-2 font-medium text-gray-700 mt-4">
        
        {/* Dashboard */}
        <button
          onClick={() => navigate("/user-panel")}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition text-[#EC733B]"
        >
          <FaHome className="text-xl" />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        {/* Go to Homepage */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-400 text-gray-600 hover:border-[#EC733B] hover:text-[#EC733B] transition">
            <FaAngleRight className="text-sm" />
          </span>
          {sidebarOpen && <span>Go to Homepage</span>}
        </button>

        {/* Orders & Packages */}
        <div className="mt-2">
          <button
            onClick={() => setOpenOrders(!openOrders)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {sidebarOpen && (
              <span className="font-semibold text-gray-500 text-sm">
                Orders & Packages
              </span>
            )}

            {sidebarOpen &&
              (openOrders ? (
                <FaAngleUp className="text-gray-500" />
              ) : (
                <FaAngleDown className="text-gray-500" />
              ))}
          </button>

          {openOrders && (
            <div className="flex flex-col ml-6 mt-1">
              <button
                onClick={() => navigate("/user/orders")}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition"
              >
                <FaShoppingCart className="text-[#EC733B]" />
                {sidebarOpen && <span>Orders</span>}
              </button>

              <button
                onClick={() => navigate("/user/credits")}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition"
              >
                <FaTags className="text-[#EC733B]" />
                {sidebarOpen && <span>Buy Credits</span>}
              </button>
            </div>
          )}
        </div>

        {/* Properties */}
        <div className="mt-2">
          <button
            onClick={() => setOpenProperties(!openProperties)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {sidebarOpen && (
              <span className="font-semibold text-gray-500 text-sm">
                Properties
              </span>
            )}

            {sidebarOpen &&
              (openProperties ? (
                <FaAngleUp className="text-gray-500" />
              ) : (
                <FaAngleDown className="text-gray-500" />
              ))}
          </button>

          {openProperties && (
            <div className="flex flex-col ml-6 mt-1">
              <button
                onClick={() => navigate("/user/my-properties")}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition"
              >
                <FaHome className="text-[#EC733B]" />
                {sidebarOpen && <span>My Properties</span>}
              </button>

              <button
                onClick={() => navigate("/user/saved")}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition"
              >
                <FaHeart className="text-[#EC733B]" />
                {sidebarOpen && <span>Saved Listings</span>}
              </button>

              <button
                onClick={() => navigate("/user/unlocked")}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EC733B]/10 transition"
              >
                <FaLockOpen className="text-[#EC733B]" />
                {sidebarOpen && <span>Unlocked Listings</span>}
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default UserSidebar;
