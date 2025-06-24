import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);
  const [formData, setFormData] = useState({
    package_id: "",
    no_of_persons: 1,
    total_price: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const pkg = location.state?.package;
    if (!pkg) {
      navigate("/destinations"); // Redirect if no package is selected
      return;
    }

    setSelectedPackage(pkg);
    setFormData((prev) => ({
      ...prev,
      package_id: pkg.id.toString(),
    }));

    fetchPackageDetail(pkg.id);
    calculateTotalPrice(pkg, 1);
  }, [location.state]);

  const fetchPackageDetail = async (pkgId) => {
    try {
      const res = await axios.get(`http://localhost:8001/api/package-details/${pkgId}`);
      setSelectedPackageDetail(res.data);
    } catch (err) {
      console.error("Error fetching package details:", err);
      setSelectedPackageDetail(null);
    }
  };

  const calculateTotalPrice = (pkg, persons) => {
    const price = pkg.package_price;
    const discount = pkg.discount || 0;
    const discountedPrice = price - (price * discount) / 100;
    const total = discountedPrice * persons;

    setFormData((prev) => ({
      ...prev,
      total_price: total.toFixed(2),
    }));

    setSelectedPackage((prev) => ({
      ...prev,
      total_price: total.toFixed(2),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "no_of_persons" ? Math.max(1, parseInt(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === "no_of_persons") {
      calculateTotalPrice(selectedPackage, updatedValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalVisible(true); // Show modal
  };

  if (!selectedPackage) return null;

  return (
    <div className="unique-admin-booking-container">
      <h2 className="unique-admin-booking-title">Book This Tour</h2>

      <div>
        <img
          src={selectedPackage?.pkg_image_url || "default-image.jpg"}
          alt={selectedPackage?.package_name || ""}
          className="unique-admin-tourpackage-package-image"
        />
      </div>

      <div className="unique-admin-booking-content">
        {/* Left: Package Details */}
        <div className="unique-admin-package-info">
          <h3>Package Information</h3>
          {selectedPackageDetail ? (
            <div className="unique-admin-package-details">
              {selectedPackageDetail.main_information && (
                <>
                  <h4>Main Information</h4>
                  <p>{selectedPackageDetail.main_information}</p>
                </>
              )}
              {selectedPackageDetail.trip_highlights?.length > 0 && (
                <>
                  <h4>Trip Highlights</h4>
                  {selectedPackageDetail.trip_highlights.map((highlight, i) => (
                    <p key={i}>{highlight}</p>
                  ))}
                </>
              )}
              {selectedPackageDetail.itinerary?.length > 0 && (
                <>
                  <h4>Itinerary</h4>
                  {selectedPackageDetail.itinerary.map((item, i) => (
                    <p key={i}>Day {i + 1}: {item}</p>
                  ))}
                </>
              )}
              {selectedPackageDetail.cost_includes?.length > 0 && (
                <>
                  <h4>Cost Includes</h4>
                  {selectedPackageDetail.cost_includes.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </>
              )}
              {selectedPackageDetail.cost_excludes?.length > 0 && (
                <>
                  <h4>Cost Excludes</h4>
                  {selectedPackageDetail.cost_excludes.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))}
                </>
              )}
            </div>
          ) : (
            <p>Loading package details...</p>
          )}
        </div>

        {/* Right: Booking Form */}
        <form onSubmit={handleSubmit} className="unique-admin-booking-form">
          <div className="unique-admin-form-group">
            <label>No. of Persons:</label>
            <input
              type="number"
              name="no_of_persons"
              min="1"
              value={formData.no_of_persons}
              onChange={handleChange}
            />
          </div>

          <div className="unique-admin-form-group">
            <label>Price:</label>
            <input type="text" value={`NPR ${selectedPackage.package_price}`} disabled />
          </div>

          <div className="unique-admin-form-group">
            <label>Discount:</label>
            <input type="text" value={`${selectedPackage.discount || 0}%`} disabled />
          </div>

          <div className="unique-admin-form-group">
            <label>Total Price:</label>
            <input type="text" value={`NPR ${formData.total_price}`} disabled />
          </div>

          <button type="submit" className="unique-admin-book-btn">Book Now</button>
        </form>
      </div>

      {/* Booking Modal */}
      {modalVisible && (
        <div className="unique-admin-booking-modal-overlay">
          <div className="unique-admin-booking-modal">
            <p>Please register and login to book this package.</p>
            <p>Do you want to register?</p>
            <div className="unique-admin-modal-buttons">
              <button className="unique-admin-yes-btn" onClick={() => navigate("/register")}>Yes</button>
              <button className="unique-admin-no-btn" onClick={() => setModalVisible(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
