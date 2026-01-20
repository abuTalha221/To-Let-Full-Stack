import React, { useEffect, useState } from "react";
import api from "../../../api";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
  MdShoppingCart,
  MdStars,
  MdRefresh,
} from "react-icons/md";

const AdminReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/admin/reports?period=${period}`);
      setReportData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 animate-pulse">Loading reports...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Failed to load report data
      </div>
    );
  }

  const { current_stats, growth, all_time, monthly_breakdown, date_range } = reportData;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Earnings Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            {date_range.start} to {date_range.end}
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e45716]"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>

          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
          >
            <MdRefresh />
            Refresh
          </button>
        </div>
      </div>

      {/* MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(current_stats.total_earnings)}
              </h2>
              <div className="flex items-center gap-1 mt-2">
                {growth.earnings >= 0 ? (
                  <MdTrendingUp className="text-green-600" />
                ) : (
                  <MdTrendingDown className="text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    growth.earnings >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(growth.earnings)}%
                </span>
                <span className="text-xs text-gray-400">vs last period</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MdAttachMoney className="text-3xl text-green-600" />
            </div>
          </div>
        </div>

        {/* Credits Sold */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Credits Sold</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {current_stats.credits_sold.toLocaleString()}
              </h2>
              <div className="flex items-center gap-1 mt-2">
                {growth.credits >= 0 ? (
                  <MdTrendingUp className="text-green-600" />
                ) : (
                  <MdTrendingDown className="text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    growth.credits >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(growth.credits)}%
                </span>
                <span className="text-xs text-gray-400">vs last period</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MdStars className="text-3xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Orders Completed */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders Completed</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {current_stats.orders_completed}
              </h2>
              <div className="flex items-center gap-1 mt-2">
                {growth.orders >= 0 ? (
                  <MdTrendingUp className="text-green-600" />
                ) : (
                  <MdTrendingDown className="text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    growth.orders >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(growth.orders)}%
                </span>
                <span className="text-xs text-gray-400">vs last period</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <MdShoppingCart className="text-3xl text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ALL TIME STATS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          📈 All-Time Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-bold text-gray-800 mt-2">
              {formatCurrency(all_time.total_earnings)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Credits Sold</p>
            <p className="text-xl font-bold text-gray-800 mt-2">
              {all_time.credits_sold.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Orders Done</p>
            <p className="text-xl font-bold text-gray-800 mt-2">
              {all_time.orders_completed}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-xl font-bold text-gray-800 mt-2">
              {all_time.total_transactions}
            </p>
          </div>
        </div>
      </div>

      {/* MONTHLY BREAKDOWN */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            📅 Monthly Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Credits Sold
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {monthly_breakdown.map((month) => (
                <tr key={month.month_number} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatCurrency(month.earnings)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {month.credits.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {month.orders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
