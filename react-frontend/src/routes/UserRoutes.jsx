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
              <Route path="/booking/:package_id" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>

          
        </div>
      </Router>
    </>
  );
};

export default UserRoutes;
