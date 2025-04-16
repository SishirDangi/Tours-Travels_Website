import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import AboutUs from "../components/AboutUs";
import TourPackages from "../components/TourPackages";
import Booking from "../components/Booking";
import EnquiryNow from "../components/EnquiryNow";
import Login from "../components/Login";
import Register from "../components/Register";
import BookingPolicy from "../components/BookingPolicy";
import Sitemap from "../components/Sitemap";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from "../components/PrivacyPolicy";
import UserDashboard from "../pages/user/UserDashboard";
import Navbar from "../components/Navbar";
import Destinations from "../components/Destinations";
const UserRoutes = () => {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<TourPackages />} />
        <Route path="/enquiry" element={<EnquiryNow />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookingpolicy" element={<BookingPolicy />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/destinations" element={<Destinations />} />

      </Routes>
    </>
  );
};

export default UserRoutes;
