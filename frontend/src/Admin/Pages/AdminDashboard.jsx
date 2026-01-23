import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  MdPeople,
  MdHomeWork,
  MdShoppingCart,
  MdPayment,
} from "react-icons/md";

/* Status color map */
const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");

      setStats(res.data.stats);
      setRecentUsers(res.data.recent_users);
      setRecentOrders(res.data.recent_orders);
    } catch (err) {
      console.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50 min-h-screen">
      {/*  HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-800">
          Dashboard
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Real-time platform overview
        </p>
      </div>

      {/*  STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={stats.total_users}
          icon={<MdPeople />}
          color="bg-blue-50 text-blue-600"
          onClick={() => navigate('/admin/manage-users')}
        />

        <StatCard
          title="Properties"
          value={stats.total_properties || 0}
          icon={<MdHomeWork />}
          color="bg-green-50 text-green-600"
          onClick={() => navigate('/admin/properties')}
        />

        <StatCard
          title="Orders"
          value={stats.total_orders}
          icon={<MdShoppingCart />}
          color="bg-purple-50 text-purple-600"
          onClick={() => navigate('/admin/orders')}
        />

        <StatCard
          title="Payments"
          value={stats.total_payments || 0}
          icon={<MdPayment />}
          color="bg-orange-50 text-orange-600"
          onClick={() => navigate('/admin/payments')}
        />
      </div>

      {/*  OVERVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/*  Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Users
          </h2>

          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users found</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-600">
              {recentUsers.map((user) => (
                <li key={user.id} className="flex justify-between">
                  <span>{user.name}</span>
                  <span className="text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/*  Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders found</p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-600">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {order.area}, {order.district}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      statusColor[order.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

/*  Reusable Stat Card */
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl shadow-md p-4 md:p-6 flex items-center justify-between hover:shadow-lg transition cursor-pointer hover:scale-105 active:scale-95"
  >
    <div>
      <p className="text-xs md:text-sm text-gray-500">{title}</p>
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
        {value}
      </h3>
    </div>

    <div
      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-xl md:text-2xl ${color}`}
    >
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
