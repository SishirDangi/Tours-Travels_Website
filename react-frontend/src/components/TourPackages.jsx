import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './TourPackages.css';

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/packages');
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="tourpackage-container">
      <h2 className="tourpackage-h2">Tour Packages</h2>
      <div className="tourpackage-packages-grid">
        {packages
          .filter(pkg => pkg.status_id === 1) // ✅ Filter only active packages
          .map(pkg => (
            <div
              key={pkg.id}
              className="tourpackage-package-card"
              onClick={() => handlePackageClick(pkg)}
            >
              <div className="tourpackage-image-container">
                <img
                  src={pkg.pkg_image_url || 'default-image.jpg'}
                  alt={pkg.package_name}
                  className="tourpackage-package-image"
                />
                <div className="tourpackage-price-tag">
                  ${Number(pkg.package_price || 0).toFixed(2)}
                </div>
              </div>
              <div className="tourpackage-package-info">
                <h3 className="tourpackage-package-title">{pkg.package_name}</h3>
                <p className="tourpackage-package-region">{pkg.package_type}</p>
                <div className="tourpackage-duration">
                  <FaClock className="tourpackage-clock-icon" />
                  <span>{pkg.duration || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {selectedPackage && (
        <div className="tourpackage-modal-overlay" onClick={handleCloseModal}>
          <div className="tourpackage-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedPackage.package_name}</h3>
            <img
              src={selectedPackage.pkg_image_url || 'default-image.jpg'}
              alt={selectedPackage.package_name}
              className="tourpackage-modal-package-image"
            />
            <p><strong>Description:</strong> {selectedPackage.package_description}</p>
            <p><strong>Package Type:</strong> {selectedPackage.package_type}</p>
            <p><strong>Price:</strong> ${Number(selectedPackage.package_price || 0).toFixed(2)}</p>
            <p><strong>Duration:</strong> {selectedPackage.duration || 'N/A'}</p>
            <div className="tourpackage-modal-buttons">
              <Link to="/booking" className="tourpackage-button booknow">Book Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPackages;
