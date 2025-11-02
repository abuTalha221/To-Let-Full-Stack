import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Pages
import Home from './User/Pages/Homepage/Home';
import About from './User/Pages/About';
import Services from './User/Pages/Services';
import Layout from './User/Components/Layout';
import AddProperty from './User/Pages/AddProperty';
import Contact from './User/Pages/Contact';
import Registration from './User/Pages/Registration/Registration';
import Login from './User/Pages/Registration/Login';
import FindHouse from './User/Pages/FindHouse';

// Admin Imports
import AdminLayout from "./Admin/Layout/AdminLayout";
import AdminDashboard from "./Admin/Pages/AdminDashboard";
import ManageProperties from "./Admin/Pages/ManageProperties";
import ManageUsers from './Admin/Pages/ManageUsers';
import Bookings from './Admin/Pages/Bookings';

const App = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-out',
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* User Side Layout */}
        <Route element={<Layout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-house" element={<FindHouse />} />
        </Route>

        {/* Admin Side Layout */}
        <Route element={<AdminLayout/>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-properties" element={<ManageProperties/>} />
          <Route path="/admin/manage-users" element={<ManageUsers/>} />
          <Route path="/admin/bookings" element={<Bookings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
