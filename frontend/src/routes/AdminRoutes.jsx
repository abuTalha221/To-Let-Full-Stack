import { Routes, Route, Navigate } from "react-router-dom";

// 🔐 Admin Login
import AdminLogin from "../Admin/Pages/Auth/AdminLogin";

// 🧱 Admin Layout & Pages
import AdminLayout from "../Admin/Layout/AdminLayout";
import AdminDashboard from "../Admin/Pages/AdminDashboard";
import AdminOrders from "../Admin/Pages/Orders/AdminOrders";
import AdminOrderDetails from "../Admin/Pages/Orders/AdminOrderDetails";
import Properties from "../Admin/Pages/Properties/AdminProperties";
import AdminPropertyDetails from "../Admin/Pages/Properties/AdminPropertyDetails";


// 🔒 Simple Admin Auth Guard
const AdminPrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem("admin_token");
  return adminToken ? children : <Navigate to="/admin" replace />;
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
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="properties" element={<Properties />}/>
        <Route path="properties/:id" element={<AdminPropertyDetails />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
