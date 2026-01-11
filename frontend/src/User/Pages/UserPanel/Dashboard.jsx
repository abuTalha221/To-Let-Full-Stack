import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { credits, ordersCount, propertiesCount } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* 🔹 Credits */}
        <div
          onClick={() => navigate("/user/credits")}
          className="bg-white shadow-sm rounded-2xl p-6 cursor-pointer
                     hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <h3 className="text-gray-600 text-sm mb-2">
            Available Credits
          </h3>
          <p className="text-4xl font-bold text-gray-900">
            {credits}
          </p>
        </div>

        {/* 🔹 Orders */}
        <div
          onClick={() => navigate("/user/orders")}
          className="bg-white shadow-sm rounded-2xl p-6 cursor-pointer
                     hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <h3 className="text-gray-600 text-sm mb-2">
            Total Orders
          </h3>
          <p className="text-4xl font-bold text-gray-900">
            {ordersCount}
          </p>
        </div>

        {/* 🔹 Properties */}
        <div
          onClick={() => navigate("/user/my-properties")}
          className="bg-white shadow-sm rounded-2xl p-6 cursor-pointer
                     hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <h3 className="text-gray-600 text-sm mb-2">
            Properties
          </h3>
          <p className="text-4xl font-bold text-gray-900">
            {propertiesCount}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
