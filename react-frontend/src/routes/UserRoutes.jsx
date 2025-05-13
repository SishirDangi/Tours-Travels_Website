import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "../components/Home";
import AboutUs from "../components/AboutUs";
import TourPackages from "../components/TourPackages";
import Booking from "../components/Booking";
import EnquiryNow from "../components/EnquiryNow";
import UserLogin from "../components/UserLogin";
import AdminLogin from "../components/AdminLogin";
import Register from "../components/Register";
import BookingPolicy from "../components/BookingPolicy";
import Sitemap from "../components/Sitemap";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from "../components/PrivacyPolicy";
import UserDashboard from "../pages/user/UserDashboard";
import ProtectedRoute from "../auth/ProtectedRoute";
import Navbar from "../components/Navbar";
import Destinations from "../components/Destinations";
import MyBookings from "../pages/user/MyBookings";

const UserRoutes = () => {
  const location = useLocation();

  // Get role from sessionStorage (or localStorage if needed)
  const role = sessionStorage.getItem("role");

  // Hide Navbar only if admin is logged in and NOT on the admin login page
  const shouldHideNavbar = role === "admin" && location.pathname !== "/admin/login";

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<TourPackages />} />
        <Route path="/enquiry" element={<EnquiryNow />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/booking/:package_id" element={<Booking />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookingpolicy" element={<BookingPolicy />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/destinations" element={<Destinations />} />

        <Route
          path="/user-dashboard/*"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/mybookings" element={<MyBookings />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
