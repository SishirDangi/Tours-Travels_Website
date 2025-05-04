import React, { useEffect, useState } from "react";
import "./Destinations.css";
import axios from "axios";
import Footer from './Footer';
import { FaClock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Destinations = () => {
  const [packages, setPackages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null); // State to handle errors
  const packagesPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8001/api/packages")
      .then((res) => {
        setPackages(res.data);

        const uniqueCategories = [
          ...new Set(res.data.map((pkg) => pkg.tour_category)),
        ].filter((category) => category);
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Please try again later."); // Set error message
      });
  }, []);

  const filteredPackages =
    selectedCategory === "All"
      ? packages
      : packages.filter((pkg) => pkg.tour_category === selectedCategory);

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const handlePackageClick = (pkg) => {
    navigate(`/booking/${pkg.id}`, { state: { package: pkg } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="destination-container">
        {/* Hero Section */}
        <div className="destination-hero">
          <img
            src="/our-destination.jpg"
            alt="Hero"
            className="destination-hero-image"
          />
          <div className="destination-hero-overlay">
            <h1 className="destination-hero-title">Our Destinations</h1>
          </div>
        </div>

        <div className="destination-content">
          {/* Sidebar */}
          <div className="sidebar">
            <h3>Tour Category</h3>
            <ul>
              <li
                className={selectedCategory === "All" ? "active" : ""}
                onClick={() => {
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
              >
                All
              </li>
              {categories.map((category, idx) => (
                <li
                  key={idx}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Packages Grid */}
          <div className="tourpackage-packages-grid">
            {error ? (
              <p className="error-message">{error}</p> // Display error message
            ) : currentPackages.length === 0 ? (
              <p>No packages available in this category.</p> // Empty state
            ) : (
              currentPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="tourpackage-package-card"
                  onClick={() => handlePackageClick(pkg)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="tourpackage-image-container">
                    <img
                      src={pkg.pkg_image_url}
                      alt={pkg.package_name}
                      className="tourpackage-package-image"
                      loading="lazy"
                    />
                    {pkg.discount > 0 && (
                      <div className="discount-badge">-{pkg.discount}%</div>
                    )}
                    <div className="tourpackage-price-tag">
                      {pkg.discount > 0 ? (
                        <>
                          <span className="original-price">
                            ${Number(pkg.package_price).toFixed(2)}
                          </span>
                          <span className="discounted-price">
                            ${Number(pkg.package_price * (1 - pkg.discount / 100)).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="discounted-price">
                          ${Number(pkg.package_price || 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="tourpackage-package-info">
                    <h3 className="tourpackage-package-title">{pkg.package_name}</h3>
                    <p className="tourpackage-package-region">{pkg.tour_category}</p>
                    <div className="tourpackage-duration">
                      <FaClock className="tourpackage-clock-icon" />
                      <span>{pkg.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Destinations;
