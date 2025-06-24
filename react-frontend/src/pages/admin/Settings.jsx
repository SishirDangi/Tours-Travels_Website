import React, { useState } from 'react';
import axios from 'axios';
// import './RegisteredUserSettings.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    password: false,
    password_confirmation: false,
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(null);

  const handleChange = (e) => {
    setErrorMessages([]);
    setSuccessMsg('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8001/api/admin/change-password',
        {
          old_password: formData.old_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setSuccessMsg(response.data.message);
      setFormData({ old_password: '', password: '', password_confirmation: '' });
      sessionStorage.removeItem('adminToken');

      let seconds = 10;
      setCountdown(seconds);
      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) {
          clearInterval(interval);
          window.location.href = '/admin/login';
        }
      }, 1000);
    } catch (err) {
      setErrorMessages([]);
      if (err.response?.data?.error) {
        setErrorMessages([err.response.data.error]);
      } else if (err.response?.data?.errors) {
        const errors = [];
        for (const key in err.response.data.errors) {
          errors.push(...err.response.data.errors[key]);
        }
        setErrorMessages(errors);
      } else {
        setErrorMessages(['An unexpected error occurred. Please try again later.']);
      }
    }
  };

  return (
    <div className="rsettingunique-settings-container">
      <h2>Admin Account Settings</h2>
      <form className="rsettingunique-settings-form" onSubmit={handleSubmit}>
        <h3>Change Password</h3>
        {[
          { name: 'old_password', label: 'Old Password' },
          { name: 'password', label: 'New Password' },
          { name: 'password_confirmation', label: 'Confirm Password' },
        ].map((field) => (
          <label key={field.name}>
            {field.label}
            <div className="rsettingunique-password-field">
              <input
                type={showPasswords[field.name] ? 'text' : 'password'}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name]}
                onChange={handleChange}
              />
              <span
                className="rsettingunique-toggle-button"
                onClick={() => toggleShow(field.name)}
              >
                {showPasswords[field.name] ? 'Hide' : 'Show'}
              </span>
            </div>
          </label>
        ))}

        <button type="submit">Change Password</button>
      </form>

      {errorMessages.length > 0 && (
        <div className="rsettingunique-modal">
          <div className="rsettingunique-modal-content error">
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <button onClick={() => setErrorMessages([])}>OK</button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="rsettingunique-modal">
          <div className="rsettingunique-modal-content success">
            <p>{successMsg}</p>
            <p>Redirecting to login in {countdown} seconds…</p>
            <p>Please login again.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;