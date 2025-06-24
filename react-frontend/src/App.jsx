import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import RegisteredUserRoutes from "./routes/RegisteredUserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Navigate } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute role="admin">
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registereduserdashboard/*"
          element={
            <ProtectedRoute role="user">
              <RegisteredUserRoutes />
            </ProtectedRoute>
          }
          />

          {/* <Route path="/registereduserdashboard/*" element={<Navigate to="/registereduser" />} /> */}

        </Routes>
    </Router>
  );
}

export default App;
