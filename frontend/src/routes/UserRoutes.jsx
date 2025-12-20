import { Routes, Route } from "react-router-dom";

// Layouts
import Layout from "../User/Components/Layout";
import UserLayout from "../User/Components/UserLayout";

// Public Pages
import Home from "../User/Pages/Homepage/Home";
import About from "../User/Pages/About";
import Services from "../User/Pages/Services";
import Contact from "../User/Pages/Contact";
import Registration from "../User/Pages/Registration/Registration";
import Login from "../User/Pages/Registration/Login";
import VerifyOtp from "../User/Pages/Registration/VerifyOtp";
import FindHouse from "../User/Pages/FindHouse";
import OrderHome from "../User/Pages/OrderHome";
import OrderPropertyNow from "../User/Pages/UserPanel/OrderPropertyNow";
import AddProperty from "../User/Pages/AddProperty";

// Payment App Flow
import Payment from "../User/Pages/Payment/Payment";
import PaymentSuccess from "../User/Pages/UserPanel/PaymentSuccess";
import PaymentFailed from "../User/Pages/UserPanel/PaymentFailed";
import PaymentProcessing from "../User/Pages/UserPanel/PaymentProcessing";

// User Panel
import UserPanel from "../User/Pages/UserPanel/Dashboard";
import BuyCredits from "../User/Pages/UserPanel/BuyCredits";
import EditProfile from "../User/Pages/UserPanel/EditProfile";
import MyOrders from "../User/Pages/UserPanel/MyOrders";
import ViewOrder from "../User/Pages/UserPanel/ViewOrder";

// Auth Guard
import PrivateRoute from "../User/Components/Auth/PrivateRoute";

const UserRoutes = () => {
  return (
    <Routes>
      {/* 🌐 PUBLIC USER ROUTES */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<Registration />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/find-house" element={<FindHouse />} />
        <Route path="/order-home" element={<OrderHome />} />
        

        <Route path="/addproperty" element={<AddProperty />} />

        {/* 💳 PAYMENT FLOW */}
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
      </Route>

      {/* 🔒 PROTECTED USER ROUTES */}
      <Route element={<PrivateRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/user-panel" element={<UserPanel />} />
          <Route path="/user/credits" element={<BuyCredits />} />
          <Route path="/order-property" element={<OrderPropertyNow />} />
          <Route path="/user/orders" element={<MyOrders />} />
          <Route path="/user/orders/:id" element={<ViewOrder />} />
        </Route>

        <Route path="/user/edit-profile" element={<EditProfile />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
