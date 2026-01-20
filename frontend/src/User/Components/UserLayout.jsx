import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "../../api";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [credits, setCredits] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0); // ✅ NEW

  useEffect(() => {
    // 🔹 fetch credits
    api.get("/credits").then((res) => {
      setCredits(res.data.credits || 0);
    });

    // 🔹 fetch orders count
    api.get("/my-orders").then((res) => {
      setOrdersCount(res.data.orders?.length || 0);
    });

    // 🔹 fetch properties count ✅
    api.get("/my-properties").then((res) => {
      setPropertiesCount(res.data.properties?.length || 0);
      // 👆 adjust key if API returns array directly
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <UserSidebar sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <UserNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          credits={credits}
          ordersCount={ordersCount}
        />

        <main className="p-4 md:p-6 overflow-y-auto h-full">
          {/* ✅ pass propertiesCount */}
          <Outlet context={{ credits, ordersCount, propertiesCount }} />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
