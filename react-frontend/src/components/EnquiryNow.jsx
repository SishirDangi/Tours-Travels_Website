import React, { useState } from "react";
import axios from "axios";
import styles from "./EnquiryNow.module.css";

const EnquiryNow = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!formData.fullName || !formData.phone || !formData.email || !formData.message) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
    
      const response = await axios.post("http://127.0.0.1:5000/enquiry", formData);
      alert(response.data.message || "Enquiry Submitted Successfully!");
      setFormData({ fullName: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting enquiry:", error.response?.data?.error || error.message);
      alert(error.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.enquiryContainer}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Enquire Now</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryNow;
