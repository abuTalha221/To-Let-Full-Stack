import React, { useState } from 'react';

// Example dummy data (you can replace this with API or real data)
const dummyProperties = Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  title: index % 2 === 0 ? 'Family House Rent' : 'Bachelor Room Rent',
  bed: Math.floor(Math.random() * 3) + 1,
  bath: Math.floor(Math.random() * 2) + 1,
  rent: 5000 + Math.floor(Math.random() * 15000),
  toLetFrom: index % 3 === 0 ? 'May' : 'June',
  location: index % 2 === 0 ? 'Mirpur' : 'Uttara',
  image: '', // Empty for now (so black TO-LET will show)
}));

const Properties = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = dummyProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const totalPages = Math.ceil(dummyProperties.length / propertiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full bg-gray-100 py-12 mt-[70px]">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Most Demanded Properties
          </h2>
          <p className="text-gray-500 mt-2">
            Discover the top rental choices that tenants are searching for the most!
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 " data-aos="fade-up">
          {currentProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Top Image or Black TO-LET */}
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-black flex items-center justify-center">
                  <h3 className="text-white text-4xl font-bold">TO-LET</h3>
                </div>
              )}

              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#EC733B] mb-2">{property.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Bed: {property.bed}, Bath: {property.bath}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  To-let from: <em>{property.toLetFrom}</em>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Rent: {property.rent} BDT
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {property.location}
                </p>

                {/* View Details Button */}
                <button
                  className="w-full bg-[#EC733B] text-white py-2 rounded hover:bg-[#d45e28] transition cursor-pointer "
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#EC733B] hover:bg-[#d45e28] rounded disabled:opacity-60"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded ${
                currentPage === number
                  ? 'bg-[#EC733B] text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#EC733B] hover:bg-[#d45e28] rounded disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Properties;
