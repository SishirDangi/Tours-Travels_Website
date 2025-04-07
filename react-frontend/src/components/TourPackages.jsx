import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TourPackages.css";

const API_URL = "http://localhost:8001/api/packages"; 
const CSRF_URL = "http://localhost:8001/sanctum/csrf-cookie";

// Set Axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8001";

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    package_name: "",
    package_description: "",
    package_type: "",
    package_price: "",
    pkg_image_path: "",
    status_id: "",
  });


  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      await axios.get(CSRF_URL);
      const response = await axios.get(API_URL);
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get(CSRF_URL);
      await axios.post(API_URL, form);
      fetchPackages();
      setForm({
        package_name: "",
        package_description: "",
        package_type: "",
        package_price: "",
        pkg_image_path: "",
        status_id: "",
      });
    } catch (error) {
      console.error("Error adding package", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.get(CSRF_URL);
      await axios.delete(`${API_URL}/${id}`);
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package", error);
    }
  };

  return (
    <div>
      <h1>Tour Packages</h1>
      <form onSubmit={handleSubmit}>
        <input name="package_name" placeholder="Name" value={form.package_name} onChange={handleChange} required />
        <input name="package_description" placeholder="Description" value={form.package_description} onChange={handleChange} />
        <input name="package_type" placeholder="Type" value={form.package_type} onChange={handleChange} />
        <input name="package_price" type="number" placeholder="Price" value={form.package_price} onChange={handleChange} required />
        <input name="pkg_image_path" placeholder="Image Path" value={form.pkg_image_path} onChange={handleChange} />
        <input name="status_id" placeholder="Status ID" value={form.status_id} onChange={handleChange} />
        <button type="submit">Add Package</button>
      </form>
      <h2>Package List</h2>
      <ul>
        {packages.map((pkg) => (
          <li key={pkg.id}>
            {pkg.package_name} - ${pkg.package_price}
            <button onClick={() => handleDelete(pkg.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourPackages;
