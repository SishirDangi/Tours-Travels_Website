import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8001/api/register', formData);
      alert(response.data.message);

      // Clear form after success
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors || error.response.data;
        alert(Object.values(errors).join('\n'));
      } else {
        alert('Unexpected error occurred.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="register-label">First Name</label>
          <input
            type="text"
            name="first_name"
            className="register-input"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="register-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="register-input"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="register-label">Email</label>
          <input
            type="email"
            name="email"
            className="register-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="register-label">Mobile No</label>
          <input
            type="text"
            name="mobile_no"
            className="register-input"
            value={formData.mobile_no}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="register-label">Password</label>
          <input
            type="password"
            name="password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="register-label">Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            className="register-input"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button className="register-button" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
