import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Guides.css";

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    languages: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [languageInput, setLanguageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://localhost:8001/api/guides";

  const fetchGuides = async () => {
    const res = await axios.get(API_URL);
    setGuides(res.data);
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()],
      });
      setLanguageInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, formData);
    } else {
      await axios.post(API_URL, formData);
    }

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      languages: [],
    });
    setEditingId(null);
    fetchGuides();
  };

  const handleEdit = (guide) => {
    setFormData({ ...guide });
    setEditingId(guide.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchGuides();
  };

  const filteredGuides = guides.filter((guide) =>
    `${guide.first_name} ${guide.last_name} ${guide.email} ${guide.phone} ${guide.gender} ${guide.address} ${guide.languages.join(", ")}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="guide-manager-container">
      <h2 className="guide-manager-title">{editingId ? "Edit Guide" : "Add Guide"}</h2>

      <form onSubmit={handleSubmit} className="guide-manager-form">
        {[
          { name: "first_name", label: "First Name" },
          { name: "last_name", label: "Last Name" },
          { name: "email", label: "Email" },
          { name: "phone", label: "Phone" },
          { name: "address", label: "Address" },
        ].map(({ name, label }) => (
          <div key={name} className="guide-manager-field">
            <label htmlFor={name} className="guide-manager-label">{label}</label>
            <input
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={label}
              className="guide-manager-input"
              required
            />
          </div>
        ))}

        <div className="guide-manager-field">
          <label htmlFor="gender" className="guide-manager-label">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="guide-manager-input"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="guide-manager-field">
          <label className="guide-manager-label">Languages</label>
          <div className="guide-manager-language-box">
            <input
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="Add Language"
              className="guide-manager-input"
            />
            <button type="button" onClick={addLanguage} className="guide-manager-button">
              Add Language
            </button>
          </div>
          <div className="guide-manager-languages-list">
            {formData.languages.map((lang, idx) => (
              <span key={idx} className="guide-manager-language">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="guide-manager-submit">
          {editingId ? "Update Guide" : "Add Guide"}
        </button>
      </form>

      <h3 className="guide-manager-subtitle">All Guides</h3>

      <div className="guide-manager-search">
        <input
          type="text"
          placeholder="Search guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="guide-manager-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Languages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuides.map((guide, index) => (
              <tr key={guide.id}>
                <td>{index + 1}</td>
                <td>{guide.first_name} {guide.last_name}</td>
                <td>{guide.email}</td>
                <td>{guide.phone}</td>
                <td>{guide.gender}</td>
                <td>{guide.address}</td>
                <td>{guide.languages.join(", ")}</td>
                <td>
                  <button onClick={() => handleEdit(guide)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(guide.id)} style={{ backgroundColor: "#dc3545" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Guides;
