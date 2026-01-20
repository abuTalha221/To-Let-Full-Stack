import React, { useEffect, useState } from "react";
import api from "../../../api";
import PropertyCard from "../../Components/PropertyCard";

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
            {currentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="px-3 md:px-4 py-2 bg-[#EC733B] hover:bg-[#d45e28] rounded disabled:opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B] text-sm md:text-base"
            >
              Previous
            </button>

            {/* Mobile: Show only current page */}
            <span className="md:hidden px-4 py-2 bg-gray-100 rounded text-sm">
              Page {currentPage} of {totalPages}
            </span>

            {/* Desktop: Show all page numbers */}
            <div className="hidden md:flex gap-2">
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
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="px-3 md:px-4 py-2 bg-[#EC733B] hover:bg-[#d45e28] rounded disabled:opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC733B] text-sm md:text-base"
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
