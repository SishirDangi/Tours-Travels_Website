import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "../pages/admin/AdminDashboard";
import RegisteredUserDashboard from "../pages/registereduser/RegisteredUserDashboard";

const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8001/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        if (role && res.data.role !== role) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) {
    return role === "admin" ? <AdminDashboard /> : <RegisteredUserDashboard />;
  }

  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/user/login"} />;
  }

  return children;
};

export default ProtectedRoute;
