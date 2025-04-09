import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DashboardHome from "../pages/admin/DashboardHome";
import Bookings from "../pages/admin/Bookings";
import Packages from "../pages/admin/Packages";
import Enquiries from "../pages/admin/Enquiries";
import Tours from "../pages/admin/Tours";
import Guides from "../pages/admin/Guides";
import Settings from "../pages/admin/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="packages" element={<Packages/>} />
        <Route path="enquiries" element={<Enquiries/>} />
        <Route path="tours" element={<Tours />} />
        <Route path="guides" element={<Guides />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
