import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import { BiBed } from "react-icons/bi";
import { FaBath } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import PlaceholderImg from "../../../assets/placeholder.svg";

// Derive app base from VITE_API_URL (falls back to local) and use it for storage
const APP_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "");
const IMAGE_BASE_URL = `${APP_BASE}/storage`;

// Helper to format prices
const formatPrice = (val) => {
  if (val == null) return "N/A";
  try {
    return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(val);
  } catch {
    return `${val} BDT`;
  }
};

const PublicProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;



  useEffect(() => {
    const controller = new AbortController();
    fetchProperties(controller.signal);
    return () => controller.abort();
  }, []);

  const [error, setError] = useState(null);

  const fetchProperties = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/public-properties", { signal });
      setProperties(res.data.properties || []);
    } catch (err) {
      // Ignore abort/cancel errors
      if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
      console.error("Failed to load public properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }; 

  /* ---------- PAGINATION LOGIC ---------- */
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const totalPages = Math.ceil(properties.length / propertiesPerPage);



  return (
    <div className="w-full bg-gray-100 py-12 mt-[70px]">
      <div className="container mx-auto px-4">
        {/* HEADING */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            All Available Rentals
          </h2>
          <p className="text-gray-500 mt-2">
            Browse every rental listing currently available
          </p>
        </div>

        {/* PROPERTIES GRID */}
        {error && (
          <div className="text-center text-red-600 mb-4">
            <p>{error}</p>
            <button
              onClick={() => fetchProperties()}
              className="mt-2 inline-block underline text-[#EC733B]"
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: propertiesPerPage }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-gray-300" />
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/3 mb-1" />
                  <div className="h-3 bg-gray-300 rounded w-1/4 mb-1" />
                  <div className="h-3 bg-gray-300 rounded w-3/4 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProperties.map((property) => {
              const image = property.images?.[0]?.image_path;
              const imgSrc = image ? `${IMAGE_BASE_URL}/${image}` : PlaceholderImg;
              const altText = property.title || `${property.area || ''}, ${property.district || ''}`;

              return (
                <div
                  key={property.id}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]"
                >
                  {/* IMAGE / TO-LET */}
                  <div className="relative">
                    <img
                      src={imgSrc}
                      alt={altText}
                      loading="lazy"
                      className="w-full h-56 object-cover"
                    />

                    {/* PRICE BADGE */}
                    <div className="absolute top-3 left-3 bg-[#EC733B] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md transform transition-all group-hover:scale-105">
                      {formatPrice(property.price)}
                    </div>

                    {/* TO-LET RIBBON */}
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                      TO-LET
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-[#EC733B]">
                        {property.categoryText} {property.property_type} Rent
                      </h3>
                      {(property.verified || property.is_verified || property.isVerified) && (
                        <span className="flex items-center text-green-600 text-sm font-medium gap-1" title="Verified">
                          <AiOutlineCheckCircle />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1"><BiBed className="text-lg" /> {property.bedroom}</span>
                      <span className="flex items-center gap-1"><FaBath className="text-lg" /> {property.bathroom}</span>
                      <span className="text-sm text-gray-500 ml-auto">To-let from: <em>{property.monthText}</em></span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {property.area}, {property.district}
                    </p>

                    {/* VIEW BUTTON */}
                    <Link
                      to={`/property-post/${property.id}`}
                      aria-label={`View details for property ${property.id}`}
                      className="w-full block text-center bg-[#EC733B] text-white py-2 rounded hover:bg-[#d45e28] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="px-4 py-2 bg-[#EC733B] hover:bg-[#d45e28] rounded disabled:opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B]"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  type="button"
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  aria-label={`Page ${number}`}
                  aria-current={currentPage === number ? "page" : undefined}
                  className={`px-4 py-2 rounded ${
                    currentPage === number
                      ? "bg-[#EC733B] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B]`}
                >
                  {number}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="px-4 py-2 bg-[#EC733B] hover:bg-[#d45e28] rounded disabled:opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProperties;
