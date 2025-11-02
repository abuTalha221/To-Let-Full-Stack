import React from "react";
import AdminNavbar from "../Components/AdminNavbar";

const AdminDashboard = () => {
  return (
    <div>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, Admin!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Properties</h2>
            <p className="text-3xl mt-2">120</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl mt-2">350</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Bookings</h2>
            <p className="text-3xl mt-2">45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
