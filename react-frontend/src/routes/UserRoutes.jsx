import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
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

const UserRoutes = () => {
  return (
    <>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
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
            </Routes>
          </div>

          
        </div>
      </Router>
    </>
  );
};

export default UserRoutes;
