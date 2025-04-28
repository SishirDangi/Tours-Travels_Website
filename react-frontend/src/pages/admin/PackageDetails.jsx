import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PackageDetails.css";

const PackageDetails = () => {
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8001/api/packages")
      .then((res) => {
        setPackages(res.data);
        const uniqueCategories = ["All", ...new Set(res.data.map(pkg => pkg.tour_category))];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Error fetching packages", err));
  }, []);

  const fetchDetails = (packageId, isEdit = false) => {
    setLoading(true);
    axios.get(`http://localhost:8001/api/package-details/${packageId}`)
      .then((res) => {
        setDetails({
          ...res.data,
          cost_includes: res.data?.cost_includes || [],
          cost_excludes: res.data?.cost_excludes || [],
          itinerary: res.data?.itinerary || [],
          trip_highlights: res.data?.trip_highlights || [],
        });
        setEditMode(isEdit);
      })
      .catch((err) => {
        console.error("Error fetching details:", err);
        setDetails(null);
      })
      .finally(() => setLoading(false));
  };

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    fetchDetails(pkg.id, false); // View Mode
  };

  const handleManageClick = (pkg) => {
    setSelectedPackage(pkg);
    fetchDetails(pkg.id, true); // Edit Mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["cost_includes", "cost_excludes", "trip_highlights"].includes(name)) {
      setDetails((prev) => ({ ...prev, [name]: value.split("\n").filter((line) => line.trim() !== "") }));
    } else {
      setDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItineraryChange = (index, value) => {
    const updated = [...details.itinerary];
    updated[index] = value;
    setDetails((prev) => ({ ...prev, itinerary: updated }));
  };

  const addDay = () => {
    setDetails((prev) => ({ ...prev, itinerary: [...prev.itinerary, ""] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setLoading(true);
    axios.post(`http://localhost:8001/api/package-details/${selectedPackage.id}`, {
      ...details,
      package_id: selectedPackage.id,
    })
      .then(() => {
        alert("Details saved successfully!");
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Error saving details:", err);
        alert("Failed to save.");
      })
      .finally(() => setLoading(false));
  };

  const filteredPackages = selectedCategory === "All"
    ? packages
    : packages.filter(pkg => pkg.tour_category === selectedCategory);

  return (
    <div className="package_wrapper">
      <h2 className="package_heading">Travel Packages</h2>

      <div className="package_layout">
        <div className="package_sidebar">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className={`sidebar_item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>

        <div className="package_main">
          {filteredPackages.length > 0 ? (
            <div className="package_grid">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="package_card">
                  <img
                    src={`http://localhost:8001/storage/${pkg.pkg_image_path}`}
                    alt={pkg.package_name}
                    className="package_image"
                  />
                  <h3>{pkg.package_name}</h3>
                  <p>{pkg.tour_category}</p>
                  <div className="card_buttons">
                    <button onClick={() => handlePackageClick(pkg)}>View</button>
                    <button onClick={() => handleManageClick(pkg)}>Manage</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no_packages">No packages found.</div>
          )}
        </div>
      </div>

      {/* View / Edit Details */}
      {details && selectedPackage && (
        <div className="details_section">
          <h3>{editMode ? `Edit: ${selectedPackage.package_name}` : `Details: ${selectedPackage.package_name}`}</h3>

          {editMode ? (
            <form onSubmit={handleSubmit}>
              <label>Main Information:</label>
              <textarea
                name="main_information"
                value={details.main_information}
                onChange={handleChange}
                rows={3}
                required
              />

              <label>Cost Includes:</label>
              <textarea
                name="cost_includes"
                value={details.cost_includes.join("\n")}
                onChange={handleChange}
                rows={4}
              />

              <label>Cost Excludes:</label>
              <textarea
                name="cost_excludes"
                value={details.cost_excludes.join("\n")}
                onChange={handleChange}
                rows={4}
              />

              <label>Trip Highlights:</label>
              <textarea
                name="trip_highlights"
                value={details.trip_highlights.join("\n")}
                onChange={handleChange}
                rows={4}
              />

              <label>Itinerary:</label>
              {details.itinerary.map((day, idx) => (
                <div key={idx} className="itinerary_day">
                  <strong>Day {idx + 1}:</strong>
                  <textarea
                    value={day}
                    onChange={(e) => handleItineraryChange(idx, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
              <button type="button" className="add_day" onClick={addDay}>+ Add Day</button>

              <div className="form_buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="view_details">
              <p><strong>Main Information:</strong> {details.main_information}</p>
              <p><strong>Cost Includes:</strong></p>
              <ul>{details.cost_includes.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

              <p><strong>Cost Excludes:</strong></p>
              <ul>{details.cost_excludes.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

              <p><strong>Trip Highlights:</strong></p>
              <ul>{details.trip_highlights.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

              <p><strong>Itinerary:</strong></p>
              <ul>{details.itinerary.map((day, idx) => <li key={idx}><strong>Day {idx + 1}:</strong> {day}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageDetails;
