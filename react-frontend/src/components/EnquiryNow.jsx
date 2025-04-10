import React, { useState } from "react";
import axios from "axios";
import "./EnquiryNow.css";

const EnquiryNow = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!formData.fullName || !formData.phone || !formData.email || !formData.message) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/api/enquiry",
        formData
      );
      setResponseMessage(response.data.message || "Enquiry Submitted Successfully!");
      setFormData({ fullName: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setResponseMessage("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enquiry-container">
      <div className="form-box">
        <h2 className="title">Enquiry Now</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="textarea"
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </div>
    </div>
  );
};

export default EnquiryNow;
