import React, { useEffect, useState } from "react";
import api from "../../../../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheck,
} from "react-icons/fa";

/* ---------- CATEGORY LABEL MAP ---------- */
const categoryMap = {
  1: "Family",
  2: "Bachelor",
  3: "Office",
  4: "Sublet",
  5: "Hostel",
};

/* ---------- FINAL STATUS COLORS ---------- */
const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-200 text-gray-700",
  rejected: "bg-red-100 text-red-800",
};

/* ---------- DATE FORMAT ---------- */
const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAction, setOpenAction] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  /* ---------- FETCH ---------- */
  const fetchProperties = async () => {
    try {
      const res = await api.get("/my-properties");
      setProperties(res.data.properties);
    } catch {
      Swal.fire("Error", "Failed to load properties", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ACTIONS ---------- */
  const handleView = (id) => navigate(`/property-post/${id}`);
  const handleCreate = () => navigate("/addproperty");
  const handleEdit = (id) => navigate(`/user/edit-property/${id}`);

  /* 🔥 USER STATUS TOGGLE (ONLY IF ADMIN ACCEPTED) */
  const handleToggleStatus = async (property) => {
    if (property.admin_status !== "accepted") {
      Swal.fire(
        "Not Allowed",
        "Admin has not approved this post yet",
        "warning"
      );
      return;
    }

    try {
      const res = await api.patch(`/properties/${property.id}/toggle-status`);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, status: res.data.property_status } : p
        )
      );

      Swal.fire(
        "Success",
        `Property is now ${res.data.property_status}`,
        "success"
      );
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    } finally {
      setOpenAction(null);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Property?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });
  };

  if (loading) {
    return (
      <p className="text-center mt-12 text-gray-500 animate-pulse">
        Loading your properties...
      </p>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">My Properties</h2>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#e45716] hover:bg-[#d35f25] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition cursor-pointer text-sm md:text-base"
        >
          <FaPlus />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          You haven’t posted any properties yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {properties.map((property) => {
            /* 🔥 FINAL STATUS DECISION */
            let finalStatus = "pending";

            if (property.admin_status === "rejected") {
              finalStatus = "rejected";
            } else if (property.admin_status === "accepted") {
              if (property.status === "active") {
                finalStatus = "active";
              } else if (property.status === "inactive") {
                finalStatus = "inactive";
              } else {
                // fallback safety
                finalStatus = "inactive";
              }
            }

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Property ID</p>
                    <h3 className="text-lg md:text-xl font-bold text-[#e45716]">
                      {property.id}
                    </h3>
                  </div>

                  {/* ✅ FINAL STATUS BADGE */}
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor[finalStatus]}`}
                  >
                    {finalStatus}
                  </span>
                </div>

                {/* INFO */}
                <div className="mt-5 space-y-2">
                  <p className="text-base md:text-lg font-semibold">
                    {categoryMap[property.primary_category]}{" "}
                    {property.property_type}
                  </p>

                  <p className="text-sm md:text-base text-gray-600">
                    {property.subarea}, {property.area}
                  </p>

                  <p className="text-xs md:text-sm text-gray-500">
                    Created : {formatDate(property.created_at)}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => handleView(property.id)}
                    className="px-3 md:px-4 py-2 bg-[#e45716] text-white rounded-lg flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
                  >
                    <FaEye /> Show Post
                  </button>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenAction(
                          openAction === property.id ? null : property.id
                        )
                      }
                      className="w-full sm:w-auto px-3 md:px-4 py-2 bg-[#e45716] text-white rounded-lg flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
                    >
                      <FaEllipsisV /> Actions
                    </button>

                    {openAction === property.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50">
                        <button
                          onClick={() => handleEdit(property.id)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 text-orange-600 flex gap-2 cursor-pointer"
                        >
                          <FaEdit /> Edit Post
                        </button>

                        {property.admin_status === "accepted" && (
                          <button
                            onClick={() => handleToggleStatus(property)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-100 flex gap-2 cursor-pointer ${
                              property.status === "active"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {property.status === "active" ? (
                              <FaBan />
                            ) : (
                              <FaCheck />
                            )}
                            {property.status === "active"
                              ? "Inactivate Post"
                              : "Activate Post"}
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(property.id)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 cursor-pointer text-red-700 flex gap-2"
                        >
                          <FaTrash /> Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
