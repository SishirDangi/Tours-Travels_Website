import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddHomePageDetails.css"; // Assuming your CSS is here

const AddHomePageDetails = () => {
  const [details, setDetails] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const BASE_URL = "http://127.0.0.1:8001/api";

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/home-page-details`);
      setDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch details", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.post(`${BASE_URL}/home-page-details/${editId}?_method=PUT`, formData);
        alert("Updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/home-page-details`, formData);
        alert("Added successfully!");
      }
      setTitle("");
      setImage(null);
      setEditId(null);
      fetchDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to save detail.");
    }
  };

  const handleEdit = (detail) => {
    setTitle(detail.title);
    setImage(null); 
    setEditId(detail.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await axios.delete(`${BASE_URL}/home-page-details/${id}`);
      alert("Deleted successfully!");
      fetchDetails();
    } catch (err) {
      console.error("Failed to delete detail", err);
      alert("Error deleting detail.");
    }
  };

  return (
    <div className="home-details-container">
      <h2>{editId ? "Edit" : "Add"} Home Page Detail</h2>
      <form onSubmit={handleSubmit} className="detail-form">
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required={!editId}
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && (
          <button type="button" onClick={() => { setTitle(""); setImage(null); setEditId(null); }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Details</h3>
      <div className="details-list">
        {details.length === 0 ? (
          <p>No details found.</p>
        ) : (
          details.map((detail) => (
            <div className="detail-card" key={detail.id}>
              <img
                src={`http://127.0.0.1:8001/storage/${detail.image_path}`}
                alt={detail.title}
                className="detail-image"
              />
              <h4>{detail.title}</h4>
              <button onClick={() => handleEdit(detail)}>Edit</button>
              <button onClick={() => handleDelete(detail.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddHomePageDetails;
