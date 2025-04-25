import React, { useEffect, useState } from 'react';
import './BookingDetails.css';

const BookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/bookings');
        const data = await res.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(b =>
      b.booking_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.contact?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.contact?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.contact?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.package?.package_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchQuery, bookings]);

  const handleView = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  return (
    <div className="bookings-container">
      <h2>All Bookings</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search bookings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <table className="bookings-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Booking Code</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Package</th>
            <th>Package Type</th>
            <th>Tour Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{(currentPage - 1) * bookingsPerPage + index + 1}</td>
              <td>{booking.booking_code}</td>
              <td>{booking.contact?.first_name} {booking.contact?.last_name}</td>
              <td>{booking.contact?.email}</td>
              <td>{booking.contact?.mobile_no}</td>
              <td>{booking.package?.package_name}</td>
              <td>{booking.package?.package_type}</td>
              <td>{booking.package?.tour_category ?? 'N/A'}</td>
              <td>{booking.status?.status_name ?? 'Pending'}</td>
              <td>
                <button className="view-btn" onClick={() => handleView(booking)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={page + 1 === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>

      {selectedBooking && (
        <div className="modal half-screen">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Booking Details</h3>
            <table className="details-table">
              <tbody>
                <tr><td>S.N.</td><td>{filteredBookings.indexOf(selectedBooking) + 1}</td></tr>
                <tr><td>Booking Code</td><td>{selectedBooking.booking_code}</td></tr>
                <tr><td>Customer Name</td><td>{selectedBooking.contact?.first_name} {selectedBooking.contact?.last_name}</td></tr>
                <tr><td>Gender</td><td>{selectedBooking.contact?.gender ?? 'N/A'}</td></tr>
                <tr><td>Email</td><td>{selectedBooking.contact?.email}</td></tr>
                <tr><td>Country</td><td>{selectedBooking.contact?.country?.country_name ?? 'N/A'}</td></tr>
                <tr><td>Phone No</td><td>{selectedBooking.contact?.mobile_no}</td></tr>
                <tr><td>Package</td><td>{selectedBooking.package?.package_name}</td></tr>
                <tr><td>Package Type</td><td>{selectedBooking.package?.package_type}</td></tr>
                <tr><td>Tour Category</td><td>{selectedBooking.package?.tour_category ?? 'N/A'}</td></tr>
                <tr><td>No. of Persons</td><td>{selectedBooking.no_of_persons}</td></tr>
                <tr><td>Total Price</td><td>${selectedBooking.total_price}</td></tr>
                <tr><td>Booking Date</td><td>{selectedBooking.booking_date}</td></tr>
                <tr><td>Tour Date</td><td>{selectedBooking.tour_date}</td></tr>
                <tr><td>Tour Duration</td><td>{selectedBooking.package?.duration}</td></tr>
                <tr><td>Status</td><td>{selectedBooking.status?.status_name ?? 'Pending'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
