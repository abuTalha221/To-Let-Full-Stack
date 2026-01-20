import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";
import { FaBars } from "react-icons/fa";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-md p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-[#e45716]"
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
        </div>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
