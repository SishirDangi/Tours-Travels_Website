// DashboardHome.jsx
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaBook,
  FaQuestionCircle,
  FaMapMarkedAlt,
  FaBoxOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./DashboardHome.css";

const endpoints = [
  { endpoint: "users/count", key: "users" },
  { endpoint: "bookings/count", key: "bookings" },
  { endpoint: "enquiries/count", key: "enquiries" },
  { endpoint: "guides/count", key: "guides" },
  { endpoint: "packages/count", key: "packages" },
];

const icons = {
  users: <FaUser />,
  bookings: <FaBook />,
  enquiries: <FaQuestionCircle />,
  guides: <FaMapMarkedAlt />,
  packages: <FaBoxOpen />,
};

const fetchCount = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.count ?? 0;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return 0;
  }
};

const DashboardHome = () => {
  const [counts, setCounts] = useState({
    users: 0,
    bookings: 0,
    enquiries: 0,
    guides: 0,
    packages: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchAllCounts = async () => {
    setLoading(true);
    const results = await Promise.all(
      endpoints.map(async ({ endpoint, key }) => {
        const url = `http://localhost:8001/api/${endpoint}`;
        const count = await fetchCount(url);
        return { key, count };
      })
    );
    const newCounts = results.reduce((acc, { key, count }) => {
      acc[key] = count;
      return acc;
    }, {});
    setCounts(newCounts);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to Admin Dashboard</h1>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="dashboard-grid">
          {Object.entries(counts).map(([key, count]) => (
            <Link key={key} to={`/admin-dashboard/${key}`} className="card-link">
              <DashboardCard
                title={`Total ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                count={count}
                icon={icons[key]}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardCard = ({ title, count, icon }) => (
  <div className="dashboard-card">
    <div className="card-icon">{icon}</div>
    <h2>{title}</h2>
    <p>{count}</p>
  </div>
);

<<<<<<< HEAD
export default DashboardHome;
=======
export default DashboardHome;
>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135
