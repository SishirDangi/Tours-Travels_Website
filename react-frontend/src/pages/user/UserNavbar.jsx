import React from "react";
import { Link } from "react-router-dom";
import "./UserNavbar.css";

const UserNavbar = ({ onSectionChange, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => onSectionChange("dashboard")}>
          <h2 style={{ color: "#f5c300", cursor: "pointer" }}>Yatra Nepal</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="#" onClick={() => onSectionChange("dashboard")}>Dashboard</Link></li>
          <li><Link to="#" onClick={() => onSectionChange("bookings")}>My Bookings</Link></li>
          <li><Link to="#" onClick={() => onSectionChange("profile")}>Profile</Link></li>
          <li><Link to="#" onClick={() => onSectionChange("saved")}>Saved Packages</Link></li>
          <li><Link to="#" onClick={() => onSectionChange("support")}>Support</Link></li>
          <li><Link to="#" onClick={onLogout}>Logout</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default UserNavbar;
