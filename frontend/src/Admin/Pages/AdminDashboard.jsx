import React from "react";
import {
  MdPeople,
  MdHomeWork,
  MdShoppingCart,
  MdAssessment,
} from "react-icons/md";

const stats = [
  {
    id: 1,
    title: "Total Users",
    value: "1,245",
    icon: <MdPeople />,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    title: "Properties",
    value: "320",
    icon: <MdHomeWork />,
    color: "bg-green-50 text-green-600",
  },
  {
    id: 3,
    title: "Orders",
    value: "178",
    icon: <MdShoppingCart />,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: 4,
    title: "Reports",
    value: "12",
    icon: <MdAssessment />,
    color: "bg-orange-50 text-orange-600",
  },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* 🔷 HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of platform activity
        </p>
      </div>

      {/* 🔷 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition"
          >
            <div>
              <p className="text-sm text-gray-500">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {item.value}
              </h3>
            </div>

            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 🔷 OVERVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Users
          </h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Masud Hasan</span>
              <span className="text-gray-400">Today</span>
            </li>
            <li className="flex justify-between">
              <span>Rashed</span>
              <span className="text-gray-400">Yesterday</span>
            </li>
            <li className="flex justify-between">
              <span>Mahmudul Rabbi</span>
              <span className="text-gray-400">2 days ago</span>
            </li>
          </ul>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Apartment – Dhaka</span>
              <span className="text-green-600 font-medium">
                Completed
              </span>
            </li>
            <li className="flex justify-between">
              <span>Flat – Uttara</span>
              <span className="text-yellow-600 font-medium">
                Pending
              </span>
            </li>
            <li className="flex justify-between">
              <span>Room – Mirpur</span>
              <span className="text-red-600 font-medium">
                Cancelled
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
