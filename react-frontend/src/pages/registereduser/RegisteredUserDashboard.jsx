import React from "react";
import { Outlet } from "react-router-dom";
import RegisteredUserSidebar from "./RegisteredUserSidebar";
import "./RegisteredUserDashboard.css";

const RegisteredUserDashboard = () => {
  return (
    <div className="registereduser-dashboard-container">
      <div className="sidebar-container">
        <RegisteredUserSidebar />
      </div>
      <div className="dashboard-main">
        <Outlet />
      </div>
    </div>
  );
};

export default RegisteredUserDashboard;
