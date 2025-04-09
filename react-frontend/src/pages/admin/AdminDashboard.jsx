import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
