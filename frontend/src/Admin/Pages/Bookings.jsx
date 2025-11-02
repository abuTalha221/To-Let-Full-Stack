import React from 'react';

const Bookings = () => {
  // Dummy bookings data
  const bookings = [
    {
      id: 1,
      userName: 'John Doe',
      propertyTitle: 'Luxury Apartment in Gulshan',
      date: '2025-05-10',
      status: 'Confirmed',
    },
    {
      id: 2,
      userName: 'Jane Smith',
      propertyTitle: 'Family House in Uttara',
      date: '2025-05-08',
      status: 'Pending',
    },
    {
      id: 3,
      userName: 'Ali Khan',
      propertyTitle: 'Modern Studio in Banani',
      date: '2025-05-05',
      status: 'Cancelled',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Property</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{booking.userName}</td>
                <td className="py-4 px-6">{booking.propertyTitle}</td>
                <td className="py-4 px-6">{booking.date}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-500'
                        : booking.status === 'Pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md">
                    View
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">
                    Cancel
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

export default Bookings;
