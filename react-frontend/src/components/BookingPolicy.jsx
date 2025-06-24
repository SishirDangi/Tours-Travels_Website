import React, { useEffect } from "react";
import "./BookingPolicy.css";
import { FaRegCheckCircle } from "react-icons/fa";

const BookingPolicy = () => {
  const policies = [
    "Book at least 7 days before travel.",
    "Pay 50% in advance to confirm your booking.",
    "Complete full payment 3 days before travel.",
    "Cancel within 24 hours of booking for a full refund.",
    "Get 90% refund if you cancel 7+ days before travel.",
    "Get 50% refund if you cancel 3–6 days before.",
    "No refund if you cancel within 3 days of travel.",
    "You can change dates up to 3 days before travel.",
    "Travel insurance is recommended (not included).",
    "We're here 24/7—call or email us anytime.",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="booking-policy-page">
        <div className="booking-policy-header">
          <h1>Booking Policies</h1>
          <p>Please read our terms carefully before booking your next adventure.</p>
        </div>

        <ul className="booking-policy-list">
          {policies.map((policy, index) => (
            <li key={index}>
              <FaRegCheckCircle className="bullet-icon" />
              <span>{policy}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default BookingPolicy;
