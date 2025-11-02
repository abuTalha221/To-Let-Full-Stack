import React from "react";

const ManageProperties = () => {
  // Dummy data for now
  const properties = [
    {
      id: 1,
      title: "Luxury Apartment in Gulshan",
      location: "Gulshan, Dhaka",
      price: "৳ 25,000/month",
      status: "Available",
    },
    {
      id: 2,
      title: "Family House in Uttara",
      location: "Uttara, Dhaka",
      price: "৳ 18,000/month",
      status: "Rented",
    },
    {
      id: 3,
      title: "Modern Studio in Banani",
      location: "Banani, Dhaka",
      price: "৳ 12,000/month",
      status: "Available",
    },
    {
      id: 4,
      title: "Penthouse in Bashundhara",
      location: "Bashundhara, Dhaka",
      price: "৳ 50,000/month",
      status: "Available",
    },
    {
      id: 5,
      title: "Small Flat in Dhanmondi",
      location: "Dhanmondi, Dhaka",
      price: "৳ 15,000/month",
      status: "Rented",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Properties</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Location</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{property.title}</td>
                <td className="py-4 px-6">{property.location}</td>
                <td className="py-4 px-6">{property.price}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      property.status === "Available"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {property.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProperties;
