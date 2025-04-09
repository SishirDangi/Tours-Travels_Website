import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TourPackages.css';
const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages from backend on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:8001/api/packages');
        setPackages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the packages:", error);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tour-packages">
      <h1>Tour Packages</h1>
      <div className="packages-list">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <img
              src={pkg.pkg_image_url || 'default-image.jpg'}
              alt={pkg.package_name}
              className="package-image"
            />
            <h3>{pkg.package_name}</h3>
            <p>{pkg.package_description}</p>
            <p>Price: ${pkg.package_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourPackages;
