import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PackageDetails.css";

const PackageDetails = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [details, setDetails] = useState({
    main_information: "",
    cost_includes: "",
    cost_excludes: "",
    itinerary: "",
    trip_highlights: ""
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Fetch all packages on load
  useEffect(() => {
    axios
      .get("http://localhost:8001/api/packages")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error("Error fetching packages", err));
  }, []);

  // Fetch details of selected package
  useEffect(() => {
    if (selectedPackageId) {
      setLoading(true);
      axios
        .get(`http://localhost:8001/api/package-details/${selectedPackageId}`)
        .then((res) => {
          setDetails({
            main_information: res.data?.main_information || "",
            cost_includes: res.data?.cost_includes || "",
            cost_excludes: res.data?.cost_excludes || "",
            itinerary: res.data?.itinerary || "",
            trip_highlights: res.data?.trip_highlights || ""
          });
        })
        .catch((err) => {
          console.error("Error fetching details:", err);
          setDetails({
            main_information: "",
            cost_includes: "",
            cost_excludes: "",
            itinerary: "",
            trip_highlights: ""
          });
        })
        .finally(() => setLoading(false));
    }
  }, [selectedPackageId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Save package details
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackageId) return;

    setLoading(true);
    axios
      .post(`http://localhost:8001/api/package-details/${selectedPackageId}`, {
        ...details,
        package_id: selectedPackageId
      })
      .then(() => {
        alert("Details saved successfully!");
        setEditing(false);
      })
      .catch((err) => {
        console.error("Error saving details:", err);
        alert("Failed to save.");
      })
      .finally(() => setLoading(false));
  };

  // Delete package details
  const handleDelete = () => {
    if (!selectedPackageId) return;

    if (window.confirm("Are you sure you want to delete this package's details?")) {
      axios
        .delete(`http://localhost:8001/api/package-details/${selectedPackageId}`)
        .then(() => {
          alert("Deleted successfully!");
          setDetails({
            main_information: "",
            cost_includes: "",
            cost_excludes: "",
            itinerary: "",
            trip_highlights: ""
          });
          setEditing(false);
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Failed to delete.");
        });
    }
  };

  return (
    <div className="package_details_container">
      <h2 className="package_details_title">Travel Package Details</h2>

      {/* Dropdown */}
      <div className="package_details_select_wrapper">
        <label>Select a Package:</label>
        <select
          value={selectedPackageId}
          onChange={(e) => {
            setSelectedPackageId(e.target.value);
            setEditing(false);
          }}
        >
          <option value="">-- Select Package --</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.package_name}
            </option>
          ))}
        </select>
      </div>

      {/* Show selected package details */}
      {selectedPackageId && !editing && (
        <div className="package_details_card">
          <h3>Package Information</h3>
          <p><strong>Main Info:</strong> {details.main_information || "Not provided"}</p>
          <p><strong>Includes:</strong> {details.cost_includes || "Not provided"}</p>
          <p><strong>Excludes:</strong> {details.cost_excludes || "Not provided"}</p>
          <p><strong>Itinerary:</strong> {details.itinerary || "Not provided"}</p>
          <p><strong>Highlights:</strong> {details.trip_highlights || "Not provided"}</p>

          <button className="package_details_button" onClick={() => setEditing(true)}>
            Edit Details
          </button>
          <button className="package_details_button" onClick={handleDelete}>
            Delete Details
          </button>
        </div>
      )}

      {/* Edit form */}
      {selectedPackageId && editing && (
        <form onSubmit={handleSubmit} className="package_details_form">
          <h3>Edit Package Details</h3>

          <div>
            <label>Main Info:</label>
            <textarea
              name="main_information"
              value={details.main_information}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div>
            <label>Cost Includes:</label>
            <textarea
              name="cost_includes"
              value={details.cost_includes}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div>
            <label>Cost Excludes:</label>
            <textarea
              name="cost_excludes"
              value={details.cost_excludes}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div>
            <label>Itinerary:</label>
            <textarea
              name="itinerary"
              value={details.itinerary}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div>
            <label>Trip Highlights:</label>
            <textarea
              name="trip_highlights"
              value={details.trip_highlights}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <button type="submit" className="package_details_button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="package_details_button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default PackageDetails;
