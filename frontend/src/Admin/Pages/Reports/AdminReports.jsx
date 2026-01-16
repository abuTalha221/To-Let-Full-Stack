import React, { useEffect, useState } from "react";
import api from "../../../api";
import { MdSearch, MdFilterList, MdFileDownload } from "react-icons/md";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data.reports || []);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      in_review: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type) => {
    const colors = {
      bug: "bg-red-100 text-red-800",
      complaint: "bg-orange-100 text-orange-800",
      suggestion: "bg-blue-100 text-blue-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading reports...
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔷 HEADER */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          Reports & Issues
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage user reports, complaints, and suggestions
        </p>
      </div>

      {/* 🔷 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Total Reports</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {reports.length}
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">New</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">
            {reports.filter((r) => r.status === "new").length}
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">In Review</p>
          <h3 className="text-2xl font-bold text-yellow-600 mt-1">
            {reports.filter((r) => r.status === "in_review").length}
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Resolved</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">
            {reports.filter((r) => r.status === "resolved").length}
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
            placeholder="Search by title or description..."
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
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* 🔷 REPORTS LIST */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredReports.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No reports found</p>
        ) : (
          <div className="divide-y">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {report.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status?.replace("_", " ")}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getTypeColor(
                          report.type
                        )}`}
                      >
                        {report.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      From: {report.user_name} • {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
