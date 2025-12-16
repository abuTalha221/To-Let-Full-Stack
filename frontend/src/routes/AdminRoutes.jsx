import { Routes, Route, Navigate } from "react-router-dom";

// 🔐 Admin Login
import AdminLogin from "../Admin/Pages/Auth/AdminLogin";

// 🧱 Admin Layout & Pages
import AdminLayout from "../Admin/Layout/AdminLayout";
import AdminDashboard from "../Admin/Pages/AdminDashboard";
import ManageProperties from "../Admin/Pages/ManageProperties";
import ManageUsers from "../Admin/Pages/ManageUsers";
import Bookings from "../Admin/Pages/Bookings";
import AdminLocationManager from "../Admin/Pages/AdminLocationManager";

// 🔒 Simple Admin Auth Guard
const AdminPrivateRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("admin_logged_in");
  return isAdminLoggedIn ? children : <Navigate to="/admin" replace />;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* 🔓 ADMIN LOGIN */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* 🔒 PROTECTED ADMIN ROUTES */}
      <Route
        path="/admin/*"
        element={
          <AdminPrivateRoute>
            <AdminLayout />
          </AdminPrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-properties" element={<ManageProperties />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="locations" element={<AdminLocationManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
