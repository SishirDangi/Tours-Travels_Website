import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaRoute,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBox,
  FaEnvelope,
  FaUsersCog,
  FaPlusCircle,
  FaClipboardList,
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dynamic check for token existence on mount and on storage events
  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Run once on mount
    checkToken();

    // Listen for token changes across tabs
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/admin/login");
    setIsModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">Tours & Travels Admin</div>
      <nav className="admin-sidebar-nav-links">
        <NavLink to="dashboard"><FaTachometerAlt /> Dashboard</NavLink>
        <NavLink to="bookings"><FaCalendarAlt /> Bookings</NavLink>
        <NavLink to="packages"><FaBox /> Packages</NavLink>
        <NavLink to="package-details"><FaClipboardList /> Package Details</NavLink>
        <NavLink to="enquiries"><FaEnvelope /> Enquiries</NavLink>
        <NavLink to="active-tours"><FaRoute /> Active Tours</NavLink>
        <NavLink to="guides"><FaUsers /> Guides</NavLink>
        <NavLink to="users"><FaUsersCog /> Users</NavLink>
        <NavLink to="add-details"><FaPlusCircle /> Add Home Page Details</NavLink>
        <NavLink to="settings"><FaCog /> Settings</NavLink>
        
      </nav>

      {isLoggedIn && (
        <button className="admin-sidebar-logout-btn" onClick={handleLogoutClick}>
          <FaSignOutAlt /> Log Out
        </button>
      )}

      {isModalOpen && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to log out?</p>
            <div className="logout-modal-buttons">
              <button onClick={handleLogoutConfirm}>Yes</button>
              <button onClick={handleLogoutCancel}>No</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
