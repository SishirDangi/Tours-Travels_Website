import React from "react";
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route here
import AdminDashboard from "../admin/AdminDashboard"; // Correct import of AdminDashboard

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Correct route path */}
      <Route path="/admin/admindashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
