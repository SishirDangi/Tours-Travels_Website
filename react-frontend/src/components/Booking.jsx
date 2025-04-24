import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Booking.css";

const Booking = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    country_id: "",
    mobile_no: "",
    address: "",
    package_id: "",
    booking_date: "",
    no_of_persons: 1,
  });

  const [countries, setCountries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [selectedPackagePrice, setSelectedPackagePrice] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCountries();
    fetchPackages();
  }, []);

  useEffect(() => {
    calculateTotalPrice(formData.package_id, formData.no_of_persons);
  }, [formData.package_id, formData.no_of_persons]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/countries");
      setCountries(response.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/packages");
      setPackages(response.data);

      // Set default selected package if any exists
      if (response.data.length > 0) {
        const defaultPackage = response.data[0];
        setFormData((prev) => ({
          ...prev,
          package_id: defaultPackage.id.toString(),
        }));
        setSelectedPackagePrice(defaultPackage.package_price);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const calculateTotalPrice = (pkgId, persons) => {
    const selected = packages.find((p) => p.id.toString() === pkgId);
    const price = selected ? selected.package_price : 0;
    setSelectedPackagePrice(price * (parseInt(persons) || 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);

    if (name === "country_id") {
      const selected = countries.find((c) => c.id.toString() === value);
      setPhoneCode(selected ? selected.phone_code : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:8001/api/bookings", formData);
      setMessage(res.data.message);
      setFormData({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        country_id: "",
        mobile_no: "",
        address: "",
        package_id: "",
        booking_date: "",
        no_of_persons: 1,
      });
      setPhoneCode("");
      setSelectedPackagePrice(0);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError("Validation error: " + JSON.stringify(err.response.data.errors));
      } else {
        setError("Something went wrong while booking.");
      }
    }
  };

  return (
    <div className="booking-wrapper">
      <h2 className="booking-title">Book This Tour</h2>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>First Name:</label>
          <input name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Country:</label>
          <select name="country_id" value={formData.country_id} onChange={handleChange} required>
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.country_name} ({c.country_code}, {c.phone_code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mobile No:</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ minWidth: "60px" }}>{phoneCode}</span>
            <input name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="Enter mobile number" />
          </div>
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Package:</label>
          <select name="package_id" value={formData.package_id} onChange={handleChange} required>
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>{pkg.package_name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tour Date:</label>
          <input name="booking_date" type="date" value={formData.booking_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>No. of Persons:</label>
          <input type="number" name="no_of_persons" value={formData.no_of_persons} min="1" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Total Price:</label>
          <div className="price-display">NPR {selectedPackagePrice}</div>
        </div>

        <button type="submit" className="book-btn">Book Now</button>
      </form>
    </div>
  );
};

export default Booking;
