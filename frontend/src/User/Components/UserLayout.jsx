import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "../../api";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [credits, setCredits] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    // 🔹 fetch credits
    api.get("/credits").then((res) => {
      setCredits(res.data.credits);
    });

    // 🔹 fetch orders count
    api.get("/my-orders").then((res) => {
      setOrdersCount(res.data.orders.length);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <UserNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          credits={credits}
          ordersCount={ordersCount}
        />

        <main className="p-4 md:p-6 overflow-y-auto h-full">
          <Outlet context={{ credits, ordersCount }} />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
