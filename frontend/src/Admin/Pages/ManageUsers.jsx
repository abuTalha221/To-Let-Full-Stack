import React, { useEffect, useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import {
  MdSearch,
  MdFilterList,
  MdBlock,
  MdCheckCircle,
} from "react-icons/md";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Block User?",
      text: "This user will not be able to access the platform",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Block",
      confirmButtonColor: "#e45716",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/admin/users/${userId}/block`);
      Swal.fire({
        icon: "success",
        title: "User Blocked",
        confirmButtonColor: "#e45716",
      });
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to block user",
      });
    }
  };

  const handleUnblockUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Unblock User?",
      text: "This user will regain access to the platform",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Unblock",
      confirmButtonColor: "#10b981",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/admin/users/${userId}/unblock`);
      Swal.fire({
        icon: "success",
        title: "User Unblocked",
        confirmButtonColor: "#e45716",
      });
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to unblock user",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.is_blocked) ||
      (filterStatus === "blocked" && user.is_blocked);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isBlocked) => {
    return isBlocked
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading users...
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔷 HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          Manage Users
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all registered users
        </p>
      </div>

      {/* 🔷 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {users.length}
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Active</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => !u.is_blocked).length}
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Blocked</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">
            {users.filter((u) => u.is_blocked).length}
          </h3>
        </div>
      </div>

      {/* 🔷 FILTERS & SEARCH */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <MdSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <MdFilterList className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent outline-none text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* 🔷 USERS TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-600 font-mono text-sm">
                      #{user.id}
                    </td>
                    <td className="px-6 py-3 text-gray-800 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{user.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          user.is_blocked
                        )}`}
                      >
                        {user.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {user.is_blocked ? (
                          <button
                            onClick={() => handleUnblockUser(user.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-xs font-semibold"
                            title="Unblock user"
                          >
                            <MdCheckCircle /> Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUser(user.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition text-xs font-semibold"
                            title="Block user"
                          >
                            <MdBlock /> Block
                          </button>
                        )}
                      </div>
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

export default ManageUsers;
