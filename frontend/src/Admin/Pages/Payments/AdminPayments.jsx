import React, { useEffect, useState } from "react";
import api from "../../../api";
import { MdSearch, MdFilterList } from "react-icons/md";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/admin/payments", {
        params: {
          search: searchTerm,
          status: filterStatus,
        },
      });
      setPayments(res.data.transactions || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const debounceSearch = () => {
    const timeout = setTimeout(() => {
      fetchPayments();
    }, 500);
    return () => clearTimeout(timeout);
  };

  useEffect(debounceSearch, [searchTerm]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getGatewayColor = (gateway) => {
    const colors = {
      sslcommerz: "bg-blue-100 text-blue-800",
      stripe: "bg-purple-100 text-purple-800",
      paypal: "bg-indigo-100 text-indigo-800",
    };
    return colors[gateway?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading payments...
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔷 HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          Payments & Transactions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all user payment transactions and credit purchases
        </p>
      </div>

      {/* 🔷 STATS CARDS */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stats.total_transactions || 0}
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">
              Rs. {stats.total_amount?.toLocaleString() || "0"}
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Credits Sold</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {stats.total_credits_sold?.toLocaleString() || 0}
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Successful</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {stats.successful_transactions || 0}
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Failed</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {stats.failed_transactions || 0}
            </h3>
          </div>
        </div>
      )}

      {/* 🔷 FILTERS & SEARCH */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <MdSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by transaction ID, user name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <MdFilterList className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

      </div>

      {/* 🔷 PAYMENTS TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredPayments.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No payments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    User
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Gateway
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-800 font-mono text-xs">
                      {payment.transaction_id}
                    </td>
                    <td className="px-6 py-3">
                      <div>
                        <p className="text-gray-800 font-medium">
                          {payment.user?.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {payment.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-800 font-semibold">
                      Rs. {payment.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-blue-600 font-semibold">
                      {payment.credits} Credits
                    </td>
                    <td className="px-6 py-3 text-gray-600 capitalize">
                      {payment.package_name || "N/A"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getGatewayColor(
                          payment.payment_gateway
                        )}`}
                      >
                        {payment.payment_gateway}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {new Date(payment.created_at).toLocaleDateString()}
                      <br />
                      <span className="text-gray-400">
                        {new Date(payment.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
