import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css"; // Styles for sidebar

const AdminSidebar = () => {
    const location = useLocation(); // Get current path

    return (
        <div className="sidebar">
            <h2>Admin Panel</h2>
            <ul>
                <li className={location.pathname === "/admin/dashboard" ? "active" : ""}>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className={location.pathname === "/admin/booking" ? "active" : ""}>
                    <Link to="/admin/booking">Booking</Link>
                </li>
                <li className={location.pathname === "/admin/tours" ? "active" : ""}>
                    <Link to="/admin/tours">Tours</Link>
                </li>
                <li className={location.pathname === "/admin/guide" ? "active" : ""}>
                    <Link to="/admin/guide">Guide</Link>
                </li>
                <li className={location.pathname === "/admin/blogs" ? "active" : ""}>
                    <Link to="/admin/blogs">Blogs</Link>
                </li>
                <li className={location.pathname === "/admin/settings" ? "active" : ""}>
                    <Link to="/admin/settings">Settings</Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
