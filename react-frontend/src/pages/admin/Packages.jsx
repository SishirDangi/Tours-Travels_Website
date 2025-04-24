import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Packages.css";

const Packages = () => {
  const [formData, setFormData] = useState({
    package_name: "",
    package_description: "",
    package_type: "",
    package_price: "",
    discount: "", // New field
    duration: "",
    status_id: "",
    pkg_image: null,
    tour_category: "",
  });

  const [packages, setPackages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 10;

  useEffect(() => {
    fetchStatuses();
    fetchPackages();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/statuses");
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pkg_image") {
      const file = files[0];
      setFormData({ ...formData, pkg_image: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      if (selectedPackage) {
        await axios.post(
          `http://localhost:8001/api/packages/${selectedPackage.id}?_method=PUT`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setMessage("Package updated successfully!");
      } else {
        await axios.post("http://localhost:8001/api/packages", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Package added successfully!");
      }

      setSelectedPackage(null);
      setFormData({
        package_name: "",
        package_description: "",
        package_type: "",
        package_price: "",
        discount: "", // Reset discount
        duration: "",
        status_id: "",
        pkg_image: null,
        tour_category: "",
      });
      setPreviewImage(null);
      document.querySelector('input[name="pkg_image"]').value = "";

      fetchPackages();
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Error processing the package.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      package_name: pkg.package_name,
      package_description: pkg.package_description,
      package_type: pkg.package_type,
      package_price: pkg.package_price,
      discount: pkg.discount || "", // Load discount
      duration: pkg.duration || "",
      status_id: pkg.status_id,
      pkg_image: null,
      tour_category: pkg.tour_category || "",
    });
    setPreviewImage(pkg.pkg_image_url || null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:8001/api/packages/${id}`);
        setMessage("Package deleted successfully!");
        fetchPackages();
      } catch (error) {
        console.error("Delete error:", error);
        setMessage("Error deleting package.");
      }
    }
  };

  const getStatusName = (id) => {
    const status = statuses.find((s) => s.id === id);
    return status
      ? status.status_name.charAt(0).toUpperCase() + status.status_name.slice(1)
      : "N/A";
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="packages-container">
      <div className="package-heading">{selectedPackage ? "Update Package" : "Add New Package"}</div>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Package Name:</label>
          <input
            type="text"
            name="package_name"
            value={formData.package_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Package Description:</label>
          <textarea
            name="package_description"
            value={formData.package_description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Package Type:</label>
          <select
            name="package_type"
            value={formData.package_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Adventure">Adventure</option>
            <option value="Nature">Nature</option>
            <option value="Culture">Culture</option>
          </select>
        </div>
        <div>
          <label>Package Price:</label>
          <input
            type="number"
            name="package_price"
            value={formData.package_price}
            step="1"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Discount (%):</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            step="1"
            min="0"
            max="100"
            onChange={handleChange}
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 3D-5N"
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status_id"
            value={formData.status_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {statuses
              .filter(
                (status) =>
                  status.status_name.toLowerCase() === "active" ||
                  status.status_name.toLowerCase() === "inactive"
              )
              .map((status) => (
                <option key={status.id} value={status.id}>
                  {status.status_name.charAt(0).toUpperCase() +
                    status.status_name.slice(1)}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Tour Category:</label>
          <input
            type="text"
            name="tour_category"
            value={formData.tour_category}
            onChange={handleChange}
            placeholder="Enter tour category (optional)"
          />
        </div>
        <div>
          <label>Package Image:</label>
          <input
            type="file"
            name="pkg_image"
            accept="image/*"
            onChange={handleChange}
            required
          />
          {previewImage && <img src={previewImage} alt="Preview" width="150" />}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : selectedPackage ? "Update Package" : "Create Package"}
        </button>
      </form>

      <div className="all-packages-design">All Packages</div>

      <div className="packages-searchbar">
        <span className="package-search-label">Search: </span>
        <input
          type="text"
          placeholder="Search by package name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", width: "200px" }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Image</th>
            <th>Type</th>
            <th>Status</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total Price</th>
            <th>Duration</th>
            <th>Tour Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPackages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.package_name}</td>
              <td><img src={pkg.pkg_image_url} alt={pkg.package_name} width="100" /></td>
              <td>{pkg.package_type}</td>
              <td>{getStatusName(pkg.status_id)}</td>
              <td>{pkg.package_price}</td>
              <td>{pkg.discount ? `${pkg.discount}%` : "0%"}</td>
              <td>
                {pkg.discount
                  ? (pkg.package_price - (pkg.package_price * pkg.discount) / 100).toFixed(2)
                  : pkg.package_price}
              </td>
              <td>{pkg.duration}</td>
              <td>{pkg.tour_category}</td>
              <td>
                <button onClick={() => handleEdit(pkg)}>Edit</button>
                <button onClick={() => handleDelete(pkg.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-buttons" style={{ marginTop: "10px" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Packages;
