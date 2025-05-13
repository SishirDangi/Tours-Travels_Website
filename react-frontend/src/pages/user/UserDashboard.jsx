import React from 'react';
import { Routes, Route } from "react-router-dom";
import MyBookings from './MyBookings';
import UserNavbar from './UserNavbar';
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <>
    <div>
      <UserNavbar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>

    </>
  )
}

export default UserDashboard



