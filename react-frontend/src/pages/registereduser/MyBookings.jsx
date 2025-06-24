import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditBookingModal from "./EditBookingModal";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [search, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:8001/api/bookings`, {
        params: { email: user?.email },
      });

      // Sort bookings by created_at descending to show latest first
      const sortedBookings = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setBookings(sortedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const filterBookings = () => {
    const filtered = bookings.filter(
      (booking) =>
        booking.package?.package_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.booking_code?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const openEditModal = (booking) => {
    const createdAt = new Date(booking.created_at);
    const now = new Date();
    const hoursDiff = Math.abs(now - createdAt) / 36e5;

    if (hoursDiff > 24) {
      alert("You cannot edit the booking after 24 hours.");
      return;
    }

    setEditingBooking(booking);
  };

  const downloadPDF = (booking) => {
    const doc = new jsPDF();

    doc.text("Booking Details", 20, 20);

    const discount = booking.package?.discount ?? 0;
    const pricePerPerson = booking.package?.package_price ?? 0;
    const discountedPrice = pricePerPerson - (pricePerPerson * discount) / 100;

    autoTable(doc, {
      startY: 30,
      head: [["Booking Info", "Details"]],
      body: [
        ["Booking Code", booking.booking_code],
        ["Package", booking.package?.package_name],
        ["Price per Person", `NPR ${discountedPrice.toFixed(2)}`],
        ["Tour Date", booking.tour_date],
        ["Booking Date", booking.booking_date],
        ["No. of Persons", booking.no_of_persons],
        ["Total Price", `NPR ${booking.total_price}`],
        ["Status", booking.status?.status_name || "Pending"],
        ["Payment Status", booking.payment_status?.status_name || "Pending"],
        ["Name", `${booking.contact?.first_name} ${booking.contact?.last_name}`],
        ["Email", booking.contact?.email],
        ["Mobile", booking.contact?.mobile_no],
        ["Country", booking.contact?.country?.country_name],
        ["Address", booking.contact?.address],
      ],
    });

    doc.save(`Booking_${booking.booking_code}.pdf`);
    alert("PDF downloaded successfully!");
  };

  return (
    <div className="mybookings-container">
      <h2>My Bookings</h2>

      <div className="mybookings-search-box">
        <input
          type="text"
          placeholder="Search by package name or booking code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {currentBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="mybookings-bookings-table">
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Booking Code</th>
              <th>Package</th>
              <th>Tour Date</th>
              <th>No. of Persons</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={booking.id}>
                <td>{indexOfFirstBooking + index + 1}</td>
                <td
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => openBookingModal(booking)}
                >
                  {booking.booking_code}
                </td>
                <td>{booking.package?.package_name}</td>
                <td>{booking.tour_date}</td>
                <td>{booking.no_of_persons}</td>
                <td>NPR {booking.total_price}</td>
                <td>{booking.status?.status_name || "Pending"}</td>
                <td>{booking.payment_status?.status_name || "Pending"}</td>
                <td>
                  <button
                    onClick={() => downloadPDF(booking)}
                    className="mybookings-action-button"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => openEditModal(booking)}
                    className="mybookings-action-button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mybookings-pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {selectedBooking && (
        <div className="mybookings-modal-overlay">
          <div className="mybookings-modal-wrapper">
            <div className="mybookings-modal-content">
              <h3>Booking Details</h3>
              <p>
                <strong>Booking Code:</strong> {selectedBooking.booking_code}
              </p>
              <p>
                <strong>Package:</strong> {selectedBooking.package?.package_name}
              </p>
              <p>
                <strong>Price per Person:</strong>{" "}
                {(() => {
                  const discount = selectedBooking.package?.discount ?? 0;
                  const pricePerPerson =
                    selectedBooking.package?.package_price ?? 0;
                  const discountedPrice =
                    pricePerPerson - (pricePerPerson * discount) / 100;
                  return `NPR ${discountedPrice.toFixed(2)}`;
                })()}
              </p>
              <p>
                <strong>Tour Date:</strong> {selectedBooking.tour_date}
              </p>
              <p>
                <strong>Booking Date:</strong> {selectedBooking.booking_date}
              </p>
              <p>
                <strong>No. of Persons:</strong> {selectedBooking.no_of_persons}
              </p>
              <p>
                <strong>Total Price:</strong> NPR {selectedBooking.total_price}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedBooking.status?.status_name || "Pending"}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedBooking.payment_status?.status_name || "Pending"}
              </p>

              <h4>Contact Details:</h4>
              <p>
                <strong>Name:</strong> {selectedBooking.contact?.first_name}{" "}
                {selectedBooking.contact?.last_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.contact?.email}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedBooking.contact?.mobile_no}
              </p>
              <p>
                <strong>Country:</strong>{" "}
                {selectedBooking.contact?.country?.country_name}
              </p>
              <p>
                <strong>Address:</strong> {selectedBooking.contact?.address}
              </p>

              <button
                onClick={closeModal}
                className="mybookings-close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={() => {
            setEditingBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;
