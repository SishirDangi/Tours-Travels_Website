import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

const RBookings = () => {
  const location = useLocation();
  const { id } = useParams();
  const selectedPkg = location.state?.package;

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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCountries();
    fetchPackages();
  }, []);

  useEffect(() => {
    const selected = location.state?.package;
    if (selected) {
      setSelectedPackage(selected);
      setFormData((prev) => ({
        ...prev,
        package_id: selected.id.toString(),
      }));
    } else {
      setSelectedPackage(null);
      setFormData((prev) => ({
        ...prev,
        package_id: "",
      }));
    }
  }, [location, id]);

  // NEW useEffect: Calculate price when packages are fetched
  useEffect(() => {
    if (packages.length > 0 && formData.package_id) {
      calculateTotalPrice(formData.package_id, formData.no_of_persons);
      fetchPackageDetail(formData.package_id);
    }
  }, [packages, formData.package_id]);

  useEffect(() => {
    if (formData.package_id && packages.length > 0) {
      calculateTotalPrice(formData.package_id, formData.no_of_persons);
      fetchPackageDetail(formData.package_id);
    }
  }, [formData.no_of_persons]);

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
    if (!packages || packages.length === 0) return;

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
      setShowModal(true);
      resetForm();
    } catch (err) {
      let errorMsg = "An error occurred while booking.";
      if (err.response?.data?.errors) {
        const allErrors = Object.values(err.response.data.errors).flat().join("\n");
        errorMsg = allErrors;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      setShowModal(true);
    }
  };

  const resetForm = () => {
    setFormData((prev) => ({
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      country_id: "",
      mobile_no: "",
      address: "",
      package_id: prev.package_id,
      booking_date: "",
      tour_date: "",
      no_of_persons: 1,
      total_price: prev.total_price,
    }));
    setPhoneCode("");
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage("");
    setError("");
  };

  return (
    <div className="booking-container">
      <div className="unique-package-info-title">
          <h1 className="booking-title">Book This Tour</h1>
      </div>
      
      <div>
        <img
          src={selectedPackage?.pkg_image_url || "default-image.jpg"}
          alt={selectedPackage?.package_name || "Tour Image"}
          className="tourpackage-package-image"
        />
      </div>

      <div className="booking-content">
        <div className="package-info">
          <div className="unique-package-info-title">
          <h1>Package Information</h1>
          </div>
          {selectedPackageDetail ? (
            <div className="package-details">
              {selectedPackageDetail.main_information && (
                <>
                  <h1>Main Information</h1>
                  <p>{selectedPackageDetail.main_information}</p>
                </>
              )}
              {selectedPackageDetail.trip_highlights?.length > 0 && (
                <>
                  <h1>Trip Highlights</h1>
                  {selectedPackageDetail.trip_highlights.map((highlight, i) => (
                    <p key={i}>{highlight}</p>
                  ))}
                </>
              )}
              {selectedPackageDetail.itinerary?.length > 0 && (
                <>
                  <h1>Itinerary</h1>
                  {selectedPackageDetail.itinerary.map((item, i) => (
                    <p key={i}>Day {i + 1}: {item}</p>
                  ))}
                </>
              )}
              {selectedPackageDetail.cost_includes?.length > 0 && (
                <>
                  <h1>Cost Includes</h1>
                  {selectedPackageDetail.cost_includes.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </>
              )}
              {selectedPackageDetail.cost_excludes?.length > 0 && (
                <>
                  <h1>Cost Excludes</h1>
                  {selectedPackageDetail.cost_excludes.map((item, i) => (
                    <p key={i}>{item} <br/> <br/></p>
                  ))}
                </>
              )}
            </div>
          ) : <p></p>}
        </div>

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
                <option key={c.id} value={c.id}>{c.country_name}</option>
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
            <label>Tour Date:</label>
            <input name="tour_date" type="date" value={formData.tour_date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>No. of Persons:</label>
            <input type="number" name="no_of_persons" value={formData.no_of_persons} min="1" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input type="text" value={`NPR ${selectedPackage?.package_price || 0}`} disabled />
          </div>

          <div className="form-group">
            <label>Discount:</label>
            <input type="text" value={`${selectedPackage?.discount || 0}%`} disabled />
          </div>

          <div className="form-group">
            <label>Total Price:</label>
            <input type="text" value={`NPR ${selectedPackage?.total_price || 0}`} disabled />
          </div>

          <button type="submit" className="book-btn">Book Now</button>
        </form>
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>{message ? "Success" : "Error"}</h3>
            <p style={{ whiteSpace: "pre-line" }}>{message || error}</p>
            <button onClick={closeModal} style={modalCloseBtnStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "400px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
};

const modalCloseBtnStyle = {
  marginTop: "15px",
  padding: "8px 20px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
};

export default RBookings;
