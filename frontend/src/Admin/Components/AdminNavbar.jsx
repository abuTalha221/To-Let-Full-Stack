import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold">Admin Panel</div>
      <div className="flex gap-6">
        <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>
        <Link to="/admin/manage-properties" className="hover:text-blue-600">Properties</Link>
        <Link to="/admin/manage-users" className="hover:text-blue-600">Users</Link>
        <Link to="/admin/bookings" className="hover:text-blue-600">Bookings</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
