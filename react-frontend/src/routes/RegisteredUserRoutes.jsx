import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisteredUserDashboard from "../pages/registereduser/RegisteredUserDashboard";
import MyBookings from "../pages/registereduser/MyBookings";
import RegisterUserProfile from "../pages/registereduser/RegisterUserProfile";
import RegisteredUserSettings from "../pages/registereduser/RegisteredUserSettings";
import RegisteredUserDashboardHome from "../pages/registereduser/RegisteredUserDashboardHome";
import RDestinations from "../pages/registereduser/RDestinations";
import RTourPackages from "../pages/registereduser/RTourPackages";
import RBookings from "../pages/registereduser/RBookings";

// Add other registered user components here if needed

const RegisteredUserRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<RegisteredUserDashboard />}>
        <Route index element={<RegisteredUserDashboardHome />} />
        <Route path="mybookings" element={<MyBookings />} />
        <Route path="rprofile" element={<RegisterUserProfile />} />
        <Route path="rsettings" element={<RegisteredUserSettings />} />
        <Route path="rdestination" element={<RDestinations />} />
        <Route path="rtourpackages" element={<RTourPackages />}/>
        <Route path="rbookings/:id" element={<RBookings />} />
        

        </Route>

    </Routes>
  );
};

export default RegisteredUserRoutes;
