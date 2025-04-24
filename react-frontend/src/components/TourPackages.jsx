import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './TourPackages.css';

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;
  const navigate = useNavigate();

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

  const filteredPackages = packages
    .filter(pkg =>
      pkg.status_id === 1 &&
      pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.package_name.localeCompare(b.package_name));

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const handlePackageClick = (pkg) => {
    navigate('/booking', { state: { package: pkg } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="tourpackage-hero">
        <img src="/our-packages.jpg" alt="Hero" className="tourpackage-hero-image" />
        <div className="tourpackage-hero-overlay">
          <h1 className="tourpackage-hero-title">Our Packages</h1>
        </div>
      </div>

      <div className="tourpackage-container">
        <div className="tourpackage-search">
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="tourpackage-packages-grid">
          {currentPackages.map(pkg => (
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
                {pkg.discount > 0 && (
                  <div className="discount-badge">-{pkg.discount}%</div>
                )}
              </div>

              <div className="tourpackage-package-info">
                <div className="tourpackage-price-tag">
                  {pkg.discount > 0 ? (
                    <>
                      <span className="original-price">
                        Rs {Number(pkg.package_price).toLocaleString()}
                      </span>
                      <span className="discounted-price">
                        Rs {Number(pkg.package_price * (1 - pkg.discount / 100)).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="discounted-price">
                      Rs {Number(pkg.package_price).toLocaleString()}
                    </span>
                  )}
                </div>

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
    </>
  );
};

export default TourPackages;
