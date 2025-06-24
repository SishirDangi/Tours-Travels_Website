import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaUser,
  FaHeadset,
  FaSignOutAlt,
  FaCog,
  FaBox,
  FaMapMarkerAlt
} from "react-icons/fa";

import "./RegisteredUserSidebar.css";

const RegisteredUserSidebar = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/user/login");
    setIsModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <aside className="registereduser-sidebar">
      <div className="registereduser-sidebar-logo">Tours & Travels</div>

      <nav className="registereduser-sidebar-nav-links">
        <NavLink to="" end>
          <FaTachometerAlt /> Dashboard
        </NavLink>
        <NavLink to="rtourpackages" end>
          <FaBox /> Tour Packages
        </NavLink>
        <NavLink to="rdestination" end>
          <FaMapMarkerAlt /> Destinations
        </NavLink>
        <NavLink to="mybookings">
          <FaCalendarCheck /> My Bookings
        </NavLink>
        <NavLink to="rprofile">
          <FaUser /> Profile
        </NavLink>
        <NavLink to="rsettings">
          <FaCog /> Settings
        </NavLink>
      </nav>

      {isLoggedIn && (
        <button
          className="registereduser-sidebar-logout-btn"
          onClick={handleLogoutClick}
        >
          <FaSignOutAlt /> Log Out
        </button>
      )}

      {isModalOpen && (
        <div className="registereduser-logout-modal">
          <div className="registereduser-logout-modal-content">
            <p>Are you sure you want to log out?</p>
            <div className="registereduser-logout-modal-buttons">
              <button onClick={handleLogoutConfirm}>Yes</button>
              <button onClick={handleLogoutCancel}>No</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RegisteredUserSidebar;
