import React, { useEffect, useState } from "react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/* 🔹 Category map */
const categoryMap = {
  1: "Family",
  2: "Bachelor",
  3: "Office",
  4: "Sublet",
  5: "Hostel",
};

/* 🔹 Admin status colors */
const adminStatusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

/* 🔹 Date formatter */
const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  /* 🔥 Fetch all properties */
  const fetchProperties = async () => {
    try {
      const res = await api.get("/admin/properties");

      // latest first
      const sorted = res.data.properties.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setProperties(sorted);
    } catch {
      Swal.fire("Error", "Failed to load properties", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading properties...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">
          Properties Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Latest properties shown first
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-5 py-4 text-left">Property ID</th>
                <th className="px-5 py-4 text-left">User</th>
                <th className="px-5 py-4 text-left">Type</th>
                <th className="px-5 py-4 text-left">Location</th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="px-5 py-4 text-left">Admin Status</th>
                <th className="px-5 py-4 text-left">Created At</th>
                <th className="px-5 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((property, index) => (
                <tr
                  key={property.id}
                  className={`border-b transition hover:bg-[#fff7f3]
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  {/* ID */}
                  <td className="px-5 py-4 font-bold text-gray-800">
                    #{property.id}
                  </td>

                  {/* User */}
                  <td className="px-5 py-4">
                    User #{property.user_id}
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    {categoryMap[property.primary_category]}{" "}
                    {property.property_type}
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4">
                    {property.area}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 font-semibold">
                    {property.price} BDT
                  </td>

                  {/* Admin Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize
                        ${adminStatusColor[property.admin_status]}`}
                    >
                      {property.admin_status}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(property.created_at)}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/properties/${property.id}`)
                      }
                      className="
                        px-4 py-1.5 rounded-lg
                        text-sm font-semibold
                        text-[#e45716]
                        border border-[#e45716]
                        hover:bg-[#e45716]
                        hover:text-white
                        transition cursor-pointer
                      "
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {properties.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No properties found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;
