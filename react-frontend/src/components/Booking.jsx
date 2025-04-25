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
    tour_date: "",
    no_of_persons: 1,
    total_price: 0,
  });

  const [countries, setCountries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCountries();
    fetchPackages();
  }, []);

  useEffect(() => {
    if (formData.package_id) {
      calculateTotalPrice(formData.package_id, formData.no_of_persons);
    }
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
      if (response.data.length > 0) {
        const defaultPackage = response.data[0];
        const defaultPackageId = defaultPackage.id.toString();
        setFormData((prev) => ({ ...prev, package_id: defaultPackageId }));
        calculateTotalPrice(defaultPackageId, formData.no_of_persons);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const calculateTotalPrice = (pkgId, persons) => {
    const selected = packages.find((p) => p.id.toString() === pkgId);
    if (!selected) return;

    const price = selected.package_price;
    const discountPercent = selected.discount || 0;
    const discountedPrice = price - (price * discountPercent) / 100;
    const total = discountedPrice * (parseInt(persons) || 1);

    setSelectedPackage({
      ...selected,
      total_price: total.toFixed(2),
      discount_percent: discountPercent,
    });

    setFormData((prev) => ({
      ...prev,
      total_price: total.toFixed(2),
    }));
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

    const updatedFormData = {
      ...formData,
      booking_date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await axios.post("http://localhost:8001/api/bookings", updatedFormData);
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
        tour_date: "",
        no_of_persons: 1,
        total_price: 0,
      });
      setPhoneCode("");
      setSelectedPackage(null);
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

      {/* Left side: Package Info */}
      <div className="package-info">
        <h3>Package Details</h3>
        {selectedPackage ? (
          <>
            <p><strong>Package Name:</strong> {selectedPackage.package_name}</p>
            <p><strong>Type:</strong> {selectedPackage.package_type}</p>
            <p><strong>Price:</strong> NPR {selectedPackage.package_price}</p>
            <p><strong>Discount:</strong> {selectedPackage.discount || 0}%</p>
            <p><strong>Total Price:</strong> NPR {selectedPackage.total_price}</p>
            <p><strong>Highlights:</strong> {selectedPackage.trip_highlights}</p>
            <p><strong>Itinerary:</strong> {selectedPackage.itinerary}</p>
          </>
        ) : (
          <p>Select a package to view details.</p>
        )}
      </div>

      {/* Right side: Booking Form */}
      <form onSubmit={handleSubmit} className="booking-form">
        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

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
              <option key={pkg.id} value={pkg.id}>
                {pkg.package_name}
              </option>
            ))}
          </select>
        </div>

        {selectedPackage && (
          <>
            <div className="form-group">
              <label>Tour Date:</label>
              <input name="tour_date" type="date" value={formData.tour_date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>No. of Persons:</label>
              <input type="number" name="no_of_persons" value={formData.no_of_persons} min="1" onChange={handleChange} />
            </div>
          </>
        )}

        <button type="submit" className="book-btn">Book Now</button>
      </form>
    </div>
  );
};

export default Booking;
