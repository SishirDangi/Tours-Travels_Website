import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select/creatable"; // Creatable select for adding new options
import "./Packages.css";

const Packages = () => {
  const [formData, setFormData] = useState({
    package_name: "",
    package_description: "",
    package_type: null, // will hold option object { value, label }
    package_price: "",
    discount: "",
    duration: "",
    status_id: "",
    pkg_image: null,
    tour_category: null, // will hold option object { value, label }
  });

  const [packages, setPackages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", messages: [], isError: false });

  const [packageTypes, setPackageTypes] = useState([]); // Options for package type select
  const [tourCategories, setTourCategories] = useState([]); // Options for tour category select

  const fileInputRef = useRef(null);

  const packagesPerPage = 7;

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
      const pkgs = response.data;
      setPackages(pkgs);

      // Extract unique package types and tour categories from packages
      const uniquePackageTypes = Array.from(new Set(pkgs.map(pkg => pkg.package_type).filter(Boolean)));
      const uniqueTourCategories = Array.from(new Set(pkgs.map(pkg => pkg.tour_category).filter(Boolean)));

      // Map them into react-select option format {value, label}
      setPackageTypes(uniquePackageTypes.map(name => ({ value: name, label: name })));
      setTourCategories(uniqueTourCategories.map(name => ({ value: name, label: name })));
    } catch (error) {
      console.error("Error fetching packages or types/categories:", error);
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

  // Handler for react-select package type
  const handlePackageTypeChange = (selectedOption) => {
    setFormData({ ...formData, package_type: selectedOption });
  };

  // Handler for react-select tour category
  const handleTourCategoryChange = (selectedOption) => {
    setFormData({ ...formData, tour_category: selectedOption });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for submission
    const form = new FormData();
    form.append("package_name", formData.package_name);
    form.append("package_description", formData.package_description);
    form.append("package_type", formData.package_type ? formData.package_type.value : "");
    form.append("package_price", formData.package_price);
    form.append("discount", formData.discount || "");
    form.append("duration", formData.duration || "");
    form.append("status_id", formData.status_id);
    form.append("tour_category", formData.tour_category ? formData.tour_category.value : "");
    if (formData.pkg_image instanceof File) {
      form.append("pkg_image", formData.pkg_image);
    }

    try {
      if (selectedPackage) {
        // Update existing package
        await axios.post(`http://localhost:8001/api/packages/${selectedPackage.id}?_method=PUT`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setModalContent({ title: "Success", messages: ["Package updated successfully!"], isError: false });
      } else {
        // Create new package
        await axios.post("http://localhost:8001/api/packages", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setModalContent({ title: "Success", messages: ["Package added successfully!"], isError: false });
      }
      setShowModal(true);
    } catch (error) {
      const messages = error.response?.data?.errors ? Object.values(error.response.data.errors).flat() : ["Unknown error occurred."];
      setModalContent({ title: "Validation Error", messages, isError: true });
      setShowModal(true);
    }
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      package_name: pkg.package_name,
      package_description: pkg.package_description,
      package_type: pkg.package_type ? { value: pkg.package_type, label: pkg.package_type } : null,
      package_price: pkg.package_price,
      discount: pkg.discount || "",
      duration: pkg.duration || "",
      status_id: pkg.status_id,
      pkg_image: null,
      tour_category: pkg.tour_category ? { value: pkg.tour_category, label: pkg.tour_category } : null,
    });
    setPreviewImage(pkg.pkg_image_url || null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:8001/api/packages/${id}`);
        fetchPackages();
        setModalContent({ title: "Deleted", messages: ["Package deleted successfully!"], isError: false });
        setShowModal(true);
      } catch (error) {
        setModalContent({ title: "Error", messages: ["Failed to delete package."], isError: true });
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);

    // Reset form & state only after modal closes
    setFormData({
      package_name: "",
      package_description: "",
      package_type: null,
      package_price: "",
      discount: "",
      duration: "",
      status_id: "",
      pkg_image: null,
      tour_category: null,
    });
    setSelectedPackage(null);
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    fetchPackages();
  };

  // Filter and pagination logic
  const filteredPackages = packages.filter(pkg =>
    pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPackages = filteredPackages.slice((currentPage - 1) * packagesPerPage, currentPage * packagesPerPage);
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  return (
    <div className="packages-container">
      {showModal && (
        <div className="modal-backdrop">
          <div className={`modal-box ${modalContent.isError ? "error" : "success"}`}>
            <h3>{modalContent.title}</h3>
            <ul>
              {modalContent.messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      <h1 className="package-heading">{selectedPackage ? "Update Package" : "Add New Package"}</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Package Name:</label>
          <input
            name="package_name"
            value={formData.package_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="package_description"
            value={formData.package_description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Package Type:</label>
          <Select
            isClearable
            onChange={handlePackageTypeChange}
            options={packageTypes}
            value={formData.package_type}
            placeholder="Select or type to add"
            formatCreateLabel={inputValue => `Add "${inputValue}"`}
            noOptionsMessage={() => "Type to add new"}
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            name="package_price"
            type="number"
            value={formData.package_price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Discount:</label>
          <input
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Duration:</label>
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
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
            <option value="">Select</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.status_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Tour Category:</label>
          <Select
            isClearable
            onChange={handleTourCategoryChange}
            options={tourCategories}
            value={formData.tour_category}
            placeholder="Select or type to add"
            formatCreateLabel={inputValue => `Add "${inputValue}"`}
            noOptionsMessage={() => "Type to add new"}
          />
        </div>

        <div>
          <label>Image:</label>
          <input
            ref={fileInputRef}
            name="pkg_image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required={!selectedPackage}
          />
          {previewImage && <img src={previewImage} alt="Preview" width="100" />}
        </div>

        <button type="submit">{selectedPackage ? "Update" : "Create"}</button>
      </form>

      <h2 className="all-packages-design">All Packages</h2>
      <div className="packages-searchbar">
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Package Type</th>
            <th>Status</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Duration</th>
            <th>Tour Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPackages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.package_name}</td>
              <td>
                <img src={pkg.pkg_image_url} alt={pkg.package_name} width="80" />
              </td>
              <td>{pkg.package_type}</td>
              <td>{pkg.status_id}</td>
              <td>{pkg.package_price}</td>
              <td>{pkg.discount || 0}%</td>
              <td>
                {(pkg.package_price - (pkg.package_price * (pkg.discount || 0)) / 100).toFixed(2)}
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

      <div className="pagination-buttons">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{currentPage}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Packages;
