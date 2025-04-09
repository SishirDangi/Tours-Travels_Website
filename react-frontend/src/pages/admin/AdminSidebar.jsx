import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaRoute,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBox,
  FaEnvelope
} from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">Tours & Travels Admin</div>
      <nav className="admin-sidebar-nav-links">
        <NavLink to="dashboard"><FaTachometerAlt /> Dashboard</NavLink>
        <NavLink to="bookings"><FaCalendarAlt /> Bookings</NavLink>
        <NavLink to="packages"><FaBox/> Packages</NavLink>
        <NavLink to="enquiries"><FaEnvelope /> Enquiries</NavLink>
        <NavLink to="tours"><FaRoute /> Tours</NavLink>
        <NavLink to="guides"><FaUsers /> Guides</NavLink>
        <NavLink to="settings"><FaCog /> Settings</NavLink>
      </nav>
      <button className="admin-sidebar-logout-btn">
        <FaSignOutAlt /> Log Out
      </button>
    </aside>
  );
};

export default AdminSidebar;
