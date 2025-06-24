import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegisteredUserDashboardHome.css'; // create your own CSS file for styling

const RegisteredUserDashboardHome = () => {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    bookingsCount: 0,
    notificationsCount: 0,
  });

  useEffect(() => {
    // Example: fetch logged-in user info (adjust URL and data shape as per your API)
    axios.get('http://localhost:8001/api/auth/user')
      .then(res => {
        setUserName(res.data.contact?.first_name || 'User');
      })
      .catch(err => console.error('Error fetching user data:', err));

    // Fetch some stats for dashboard quick view
    axios.get('http://localhost:8001/api/user/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Error fetching dashboard stats:', err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome back, {userName}!</h1>
      <p>This is your dashboard home page.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>My Bookings</h3>
          <p>{stats.bookingsCount}</p>
          {/* Add a NavLink or button to go to bookings page */}
        </div>
        <div className="card">
          <h3>Notifications</h3>
          <p>{stats.notificationsCount}</p>
          {/* Link to notifications */}
        </div>
      </div>
    </div>
  );
};

export default RegisteredUserDashboardHome;
