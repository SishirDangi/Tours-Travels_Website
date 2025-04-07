import React from 'react';
import './ContactInfo.css';

const ContactInfo = () => {
  return (
    <div className="contactinfo-container">
      <h2 className="contactinfo-heading">Contact Information</h2>

      <div className="contactinfo-details">
        <p><strong>Phone:</strong> +977-9841168611 / 9849007375</p>
        <p><strong>Email:</strong> <a href="mailto:info@yatranepal.com">info@yatranepal.com</a></p>
        <p><strong>GPO Box:</strong> 44800, Bhaktapur, Nepal</p>
        <p><strong>Location:</strong> Kausaltar, Bhaktapur, Nepal</p>
        <p><strong>Office Hours:</strong> Sun–Fri: 10:00 A.M – 5:00 P.M | Saturday: <span className="closed">CLOSED</span></p>
      </div>
    </div>
  );
};

export default ContactInfo;
