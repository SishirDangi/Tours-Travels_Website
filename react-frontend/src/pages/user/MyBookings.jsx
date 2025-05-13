import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyBookings.css"; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assuming email is stored in localStorage after login
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8001/api/bookings");
        setBookings(response.data);
        filterUserBookings(response.data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filterUserBookings = (data) => {
    const userBookings = data.filter(
      (booking) => booking.contact?.email === userEmail
    );
    setFilteredBookings(userBookings);
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>
      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-list">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>{booking.package?.package_name}</h3>
              <p><strong>Booking Code:</strong> {booking.booking_code}</p>
              <p><strong>Tour Date:</strong> {booking.tour_date}</p>
              <p><strong>Booking Date:</strong> {booking.booking_date}</p>
              <p><strong>No. of Persons:</strong> {booking.no_of_persons}</p>
              <p><strong>Total Price:</strong> Rs. {booking.total_price}</p>
              <p><strong>Status:</strong> {booking.status?.status_name || "Pending"}</p>
              <p><strong>Payment:</strong> {booking.payment_status?.name || "Unpaid"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
