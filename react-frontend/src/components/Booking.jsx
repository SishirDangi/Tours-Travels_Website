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
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCountries();
    fetchPackages();
  }, []);

  useEffect(() => {
    if (formData.package_id) {
      calculateTotalPrice(formData.package_id, formData.no_of_persons);
      fetchPackageDetail(formData.package_id);
    }
  }, [formData.package_id, formData.no_of_persons]);

  const fetchCountries = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/countries");
      setCountries(res.data);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/packages");
      setPackages(res.data);
      if (res.data.length > 0) {
        const defaultPackage = res.data[0];
        const defaultPackageId = defaultPackage.id.toString();
        setFormData((prev) => ({ ...prev, package_id: defaultPackageId }));
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const fetchPackageDetail = async (pkgId) => {
    try {
      const res = await axios.get(`http://localhost:8001/api/package-details/${pkgId}`);
      setSelectedPackageDetail(res.data);
    } catch (err) {
      console.error("Error fetching package details:", err);
      setSelectedPackageDetail(null);
    }
  };

  const calculateTotalPrice = (pkgId, persons) => {
    const selected = packages.find((pkg) => pkg.id.toString() === pkgId);
    if (!selected) return;

    const price = selected.package_price;
    const discount = selected.discount || 0;
    const discountedPrice = price - (price * discount) / 100;
    const total = discountedPrice * (parseInt(persons) || 1);

    setSelectedPackage({
      ...selected,
      total_price: total.toFixed(2),
      discount_percent: discount,
    });

    setFormData((prev) => ({
      ...prev,
      total_price: total.toFixed(2),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "country_id") {
      const selectedCountry = countries.find((c) => c.id.toString() === value);
      setPhoneCode(selectedCountry?.phone_code || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const submissionData = {
      ...formData,
      booking_date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await axios.post("http://localhost:8001/api/bookings", submissionData);
      setMessage(res.data.message || "Booking successful!");
      resetForm();
    } catch (err) {
      if (err.response?.data?.errors) {
        setError("Validation error: " + JSON.stringify(err.response.data.errors));
      } else {
        setError("An error occurred while booking.");
      }
    }
  };

  const resetForm = () => {
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
    setSelectedPackageDetail(null);
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book This Tour</h2>
      <div>
        <img
          src={selectedPackage?.pkg_image_url || "default-image.jpg"}
          alt={selectedPackage?.package_name || " "}
          className="tourpackage-package-image"
        />
      </div>

      <div className="booking-content">
        {/* Left Side - Package Details */}
        <div className="package-info">
          <h3>Package Information</h3>
          {selectedPackageDetail ? (
            <div className="package-details">
              {selectedPackageDetail.main_information && (
                <>
                  <h4>Main Information</h4>
                  <p>{selectedPackageDetail.main_information}</p>
                </>
              )}

              {selectedPackageDetail.trip_highlights?.length > 0 && (
                <>
                  <h4>Trip Highlights</h4>
                  {selectedPackageDetail.trip_highlights.map((highlight, index) => (
                    <p key={index}>{highlight}</p>
                  ))}
                </>
              )}

              {selectedPackageDetail.itinerary?.length > 0 && (
                <>
                  <h4>Itinerary</h4>
                  {selectedPackageDetail.itinerary.map((item, index) => (
                    <p key={index}>Day {index + 1}: {item}</p>
                  ))}
                </>
              )}

              {selectedPackageDetail.cost_includes?.length > 0 && (
                <>
                  <h4>Cost Includes</h4>
                  {selectedPackageDetail.cost_includes.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </>
              )}

              {selectedPackageDetail.cost_excludes?.length > 0 && (
                <>
                  <h4>Cost Excludes</h4>
                  {selectedPackageDetail.cost_excludes.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </>
              )}
            </div>
          ) : (
            <p> </p>
          )}
        </div>

        {/* Right Side - Booking Form */}
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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
                  {c.country_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Mobile No:</label>
            <div className="mobile-input">
              <span>{phoneCode}</span>
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

              <div className="form-group">
                <label>Price:</label>
                <input type="text" value={`NPR ${selectedPackage.package_price}`} disabled />
              </div>

              <div className="form-group">
                <label>Discount:</label>
                <input type="text" value={`${selectedPackage.discount || 0}%`} disabled />
              </div>

              <div className="form-group">
                <label>Total Price:</label>
                <input type="text" value={`NPR ${selectedPackage.total_price}`} disabled />
              </div>
            </>
          )}

          <button type="submit" className="book-btn">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
