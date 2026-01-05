import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import Swal from "sweetalert2";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMale,
  FaBuilding,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const IMAGE_BASE_URL = "http://localhost:8000";

const AdminPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    if (previewIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") setPreviewIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex, property]);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/admin/properties/${id}`);
      setProperty(res.data.property);
    } catch {
      Swal.fire("Error", "Failed to load property details", "error");
      navigate("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- IMAGE NAV ---------- */
  const showPrev = () => {
    if (!property?.images?.length) return;
    setPreviewIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const showNext = () => {
    if (!property?.images?.length) return;
    setPreviewIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  /* ---------- ADMIN ACTIONS ---------- */
  const updateStatus = async (status) => {
    try {
      await api.patch(`/admin/properties/${id}/status`, {
        admin_status: status,
      });

      Swal.fire("Success", `Property ${status}`, "success");
      fetchProperty();
    } catch (err) {
      console.log(err.response?.data);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Validation failed",
        "error"
      );
    }
  };

  const statusBadge = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const deleteProperty = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This property will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admin/properties/${property.id}`);

      Swal.fire("Deleted!", "Property has been deleted.", "success");
      navigate("/admin/properties");
    } catch {
      Swal.fire("Error", "Failed to delete property", "error");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading property details...
      </p>
    );
  }

  if (!property) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* TITLE */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-lg font-semibold text-[#e45716]">
            {property.title}
          </h1>

          {/* CURRENT STATUS */}
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${
              statusBadge[property.admin_status]
            }`}
          >
            {property.admin_status}
          </span>
        </div>

        <p className="text-sm text-gray-500">Property ID: #{property.id}</p>
      </div>

      {/* IMAGES */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-4">Images</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {property.images?.map((img, index) => (
            <img
              key={img.id}
              src={`${IMAGE_BASE_URL}/storage/${img.image_path}`}
              alt={`Property image ${index + 1}`}
              className="h-32 w-full object-cover rounded-lg border cursor-pointer"
              onClick={() => setPreviewIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-5 py-4 font-semibold">Basic information</div>

        <div className="flex flex-wrap gap-16 px-5 py-4 text-sm">
          <div className="flex items-center gap-2">
            <FaBed /> Bedroom: {property.bedroom}
          </div>
          <div className="flex items-center gap-2">
            <FaBath /> Bathroom: {property.bathroom}
          </div>
          <div className="flex items-center gap-2">
            <FaLayerGroup /> Balcony: {property.balcony ?? "-"}
          </div>
          <div className="flex items-center gap-2">
            <FaBuilding /> Floor: {property.floor ?? "-"}
          </div>
          <div className="flex items-center gap-2">
            <FaRulerCombined /> Size: {property.size ?? "-"} sqft
          </div>
          <div className="flex items-center gap-2">
            <FaMale /> Gender:{" "}
            {property.gender === 1
              ? "Male"
              : property.gender === 2
              ? "Female"
              : "Both"}
          </div>
        </div>

        <hr />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-5 py-4 text-sm">
          <div>
            <p className="text-gray-400">PROPERTY ID</p>
            <p className="font-medium">{property.id}</p>
          </div>

          <div>
            <p className="text-gray-400">UPDATED AT</p>
            <p className="font-medium">{formatDate(property.updated_at)}</p>
          </div>

          <div>
            <p className="text-gray-400">AVAILABLE FROM</p>
            <p className="font-medium">{property.monthText}</p>
          </div>

          <div>
            <p className="text-gray-400">CATEGORY</p>
            <p className="font-medium">{property.categoryText}</p>
          </div>

          <div>
            <p className="text-gray-400">PROPERTY TYPE</p>
            <p className="font-medium">{property.property_type}</p>
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-5 flex items-center gap-2 text-gray-800">
          <FaMapMarkerAlt className="text-[#e45716]" />
          Location information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm">
          <div>
            <p className="text-gray-400">Division</p>
            <p className="font-medium text-gray-800">{property.division}</p>
          </div>

          <div>
            <p className="text-gray-400">District</p>
            <p className="font-medium text-gray-800">{property.district}</p>
          </div>

          <div>
            <p className="text-gray-400">Area / Thana</p>
            <p className="font-medium text-gray-800">{property.area}</p>
          </div>

          <div>
            <p className="text-gray-400">Sub Area</p>
            <p className="font-medium text-gray-800">
              {property.subarea ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Sector No</p>
            <p className="font-medium text-gray-800">
              {property.sector_no ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Road No</p>
            <p className="font-medium text-gray-800">
              {property.road_no ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">House No</p>
            <p className="font-medium text-gray-800">
              {property.house_no ?? "-"}
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <FaUser /> Contact information
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <FaPhone /> {property.contact}
        </div>
      </div>

      {/* PRICE */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold">Price</h2>
        <p className="text-2xl font-bold">{property.price} BDT</p>
        <p className="text-sm text-gray-500">{property.price_type}</p>
      </div>

      {/* PRICE INCLUDED */}
      {(property.gas ||
        property.water ||
        property.lift ||
        property.security ||
        property.electricity) && (
        <div className="bg-white rounded-xl shadow p-5 b">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            Price included with
          </h2>

          <ul className="text-sm space-y-1">
            {property.gas === 1 && <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Gas Bill</li>}
            {property.water === 1 && <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Water Bill</li>}
            {property.lift === 1 && <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Lift Bill</li>}
            {property.security === 1 && <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Security Bill</li>}
            {property.electricity === 1 && <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Electricity Bill</li>}
          </ul>
        </div>
      )}

      {/* ADMIN ACTIONS */}
      <div className="bg-white rounded-xl shadow p-5">
        {/* TITLE */}
        <h2 className="font-semibold mb-4 text-gray-800">Update Post Status</h2>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => updateStatus("accepted")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded cursor-pointer transition"
          >
            Accept
          </button>

          <button
            onClick={() => updateStatus("rejected")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded cursor-pointer transition"
          >
            Reject
          </button>

          <button
            onClick={deleteProperty}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded cursor-pointer transition flex items-center gap-2"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>

      {/* FULLSCREEN IMAGE */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            <FaTimes />
          </button>

          <button
            onClick={showPrev}
            className="absolute left-6 text-white text-3xl"
          >
            <FaChevronLeft />
          </button>

          <img
            src={`${IMAGE_BASE_URL}/storage/${property.images[previewIndex].image_path}`}
            alt={`Property preview ${previewIndex + 1}`}
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />

          <button
            onClick={showNext}
            className="absolute right-6 text-white text-3xl"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyDetails;
