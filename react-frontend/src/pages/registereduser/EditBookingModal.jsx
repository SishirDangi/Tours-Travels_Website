import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./EditBookingModal.css";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [tourDate, setTourDate] = useState(booking.tour_date);
  const [noOfPersons, setNoOfPersons] = useState(booking.no_of_persons);
  const [firstName, setFirstName] = useState(booking.contact?.first_name);
  const [lastName, setLastName] = useState(booking.contact?.last_name);
  const [mobileNo, setMobileNo] = useState(booking.contact?.mobile_no);
  const [address, setAddress] = useState(booking.contact?.address);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  const token = localStorage.getItem("token"); // Get token from local storage

  const calculateTotalPrice = (persons) => {
    const pricePerPerson = booking.package?.package_price || 0;
    const discount = booking.package?.discount || 0;
    const discountedPrice = pricePerPerson - (pricePerPerson * discount) / 100;
    return discountedPrice * persons;
  };

  const [totalPrice, setTotalPrice] = useState(
    calculateTotalPrice(booking.no_of_persons)
  );

  useEffect(() => {
    const createdAt = new Date(booking.created_at);
    const now = new Date();
    const diffMs = createdAt.getTime() + 24 * 3600 * 1000 - now.getTime();

    if (diffMs > 0) {
      setTimeLeft(Math.floor(diffMs / 1000));
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [booking]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const canEdit = timeLeft > 0;

  const handleNoOfPersonsChange = (e) => {
    const persons = parseInt(e.target.value) || 0;
    setNoOfPersons(persons);
    setTotalPrice(calculateTotalPrice(persons));
  };

  const handleSave = async () => {
    if (!canEdit) {
      alert("Editing period of 24 hours has expired.");
      return;
    }

    setSaving(true);
    try {
      // Update contact
      await axios.put(
        `http://localhost:8001/api/contacts/${booking.contact?.id}`,
        {
          first_name: firstName,
          last_name: lastName,
          mobile_no: mobileNo,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update booking
      await axios.put(
        `http://localhost:8001/api/bookings/${booking.id}`,
        {
          tour_date: tourDate,
          booking_date: booking.booking_date,
          total_price: totalPrice,
          contact_id: booking.contact?.id,
          package_id: booking.package?.id,
          status_id: booking.status_id,
          payment_status_id: booking.payment_status_id,
          no_of_persons: noOfPersons,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking updated successfully.");
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="registeruser-modal-overlay">
      <div className="registeruser-modal-content">
        <h3>Edit Booking</h3>

        {!canEdit ? (
          <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
            Editing period of 24 hours has expired.
          </p>
        ) : (
          <p style={{ color: "#444", fontWeight: "600", textAlign: "center" }}>
            Time left to edit: {formatTime(timeLeft)} (HH:MM:SS)
          </p>
        )}

        <label>Tour Date:</label>
        <input
          type="date"
          value={tourDate}
          onChange={(e) => setTourDate(e.target.value)}
          disabled={!canEdit}
        />

        <label>No. of Persons:</label>
        <input
          type="number"
          min="1"
          value={noOfPersons}
          onChange={handleNoOfPersonsChange}
          disabled={!canEdit}
        />

        <p>
          <strong>Total Price:</strong> Rs. {totalPrice.toFixed(2)}
        </p>

        <h4>Contact Info:</h4>

        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={!canEdit}
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!canEdit}
        />

        <label>Mobile No:</label>
        <input
          type="text"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          disabled={!canEdit}
        />

        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!canEdit}
        />

        <div className="registeruser-button-group">
          <button
            onClick={handleSave}
            disabled={saving || !canEdit}
            className="registeruser-save-button"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="registeruser-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
