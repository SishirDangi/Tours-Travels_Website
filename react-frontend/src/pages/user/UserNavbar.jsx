import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserNavbar.css"; // You can style modal here or inline

const UserNavbar = ({ onSectionChange }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Confirm logout
  const confirmLogout = async () => {
    try {
      // Make logout request to backend
      await axios.post("http://localhost:8001/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // Clear both localStorage and sessionStorage
      localStorage.removeItem("access_token");
      sessionStorage.clear(); // Clears all session data

      // Navigate to login page
      navigate("/user/login");
    } catch (error) {
      console.error("Logout failed:", error);

      // Clear both localStorage and sessionStorage even if logout fails
      localStorage.removeItem("access_token");
      sessionStorage.clear();

      // Redirect to login page
      navigate("/user/login");
    }
  };

  return (
    <>
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
            <li><Link to="#" onClick={() => setShowModal(true)}>Logout</Link></li>
          </ul>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="yes" onClick={confirmLogout}>Yes</button>
              <button className="no" onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
