import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <UserSidebar sidebarOpen={sidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <UserNavbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 overflow-y-auto h-full">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default UserLayout;
