import React, { useState, useEffect } from "react";
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
import Destinations from "../components/Destinations";
import Navbar from "../components/Navbar";
import Faqss from "../components/Faqss";

const UserRoutes = () => {
  const location = useLocation();
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, [location]);

  // Hide Navbar only if role is 'user' and user is inside their dashboard
  const shouldHideNavbar = role === "user" && location.pathname.startsWith("/registereduser");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<TourPackages />} />
         <Route path="/packages/:id" element={<TourPackages />} />
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
        <Route path="/faqs" element={<Faqss />} />
      </Routes>
    </>
  );
};

export default UserRoutes;
