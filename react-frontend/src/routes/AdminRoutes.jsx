import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DashboardHome from "../pages/admin/DashboardHome";
import BookingDetails from "../pages/admin/BookingDetails";
import Packages from "../pages/admin/Packages";
import PackageDetails from "../pages/admin/PackageDetails";
import Enquiries from "../pages/admin/Enquiries";
import ActiveTours from "../pages/admin/ActiveTours";
import Guides from "../pages/admin/Guides";
import Users from "../pages/admin/Users";
import AddHomePageDetails from "../pages/admin/AddHomePageDetails";
import Settings from "../pages/admin/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* AdminDashboard is the parent route */}
      <Route path="/" element={<AdminDashboard />}>
        {/* Default route for AdminDashboard (index route) */}
        <Route index element={<DashboardHome />} />
        {/* Other nested routes */}
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="bookings" element={<BookingDetails />} />
        <Route path="packages" element={<Packages />} />
        <Route path="package-details" element={<PackageDetails />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="active-tours" element={<ActiveTours />} />
        <Route path="guides" element={<Guides />} />
        <Route path="users" element={<Users />} />
        <Route path="add-details" element={<AddHomePageDetails />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
