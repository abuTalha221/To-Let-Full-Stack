import React, { useEffect, useState } from "react";
import api from "../../../api"; // adjust path if needed

const Dashboard = () => {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    api.get("/credits").then((res) => {
      setCredits(res.data.credits);
    });
  }, []);

  return (
    <div className="p-4 md:p-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm border rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm mb-2">Available Credits</h3>
          <p className="text-4xl font-bold text-gray-900">{credits}</p>
        </div>

        <div className="bg-white shadow-sm border rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm mb-2">House Posts</h3>
          <p className="text-4xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white shadow-sm border rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm mb-2">Orders</h3>
          <p className="text-4xl font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
