import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegisterUserProfile.css';

const Modal = ({ message, onClose, type }) => {
  if (!message) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${type === 'error' ? 'modal-error' : 'modal-success'}`}
        onClick={e => e.stopPropagation()}
      >
        <p>{message}</p>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const RegisterUserProfile = () => {
  const [contact, setContact] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    mobile_no: '',
    email: '',
    address: '',
    country_id: '',
  });
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    // Get contact
    axios
      .get('http://localhost:8001/api/contact', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        withCredentials: true,
      })
      .then(res => {
        setContact(res.data);
        setFormData({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          gender: res.data.gender || '',
          mobile_no: res.data.mobile_no || '',
          email: res.data.email || '',
          address: res.data.address || '',
          country_id: res.data.country_id || '',
        });
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch contact details.');
      })
      .finally(() => {
        setLoading(false);
      });

    // Get countries
    axios
      .get('http://localhost:8001/api/countries')
      .then(res => {
        setCountries(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setError('Failed to load countries.');
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setUpdating(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8001/api/contacts/${contact.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          withCredentials: true,
        }
      );
      setSuccessMsg(response.data.message);
      setContact(response.data.contact);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError('Update failed. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const closeModal = () => {
    setError('');
    setSuccessMsg('');
  };

  if (loading) return <p className="registeruserprofile-loading">Loading...</p>;

  const currentCountryName =
    countries.find(c => c.id === Number(formData.country_id))?.country_name || 'Not selected';

  return (
    <div className="registeruserprofile-container">
      <h2 className="registeruserprofile-title">User Profile</h2>

      <Modal message={error} onClose={closeModal} type="error" />
      <Modal message={successMsg} onClose={closeModal} type="success" />

      <form onSubmit={handleSubmit} className="registeruserprofile-form">
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Mobile No:
          <input
            type="tel"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Current Country:
          <input type="text" value={currentCountryName} readOnly />
        </label>

        <label>
          Change Country:
          <select
            className="reg-country-select"
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
            required
          >
            <option value="">Select country</option>
            {countries.map(c => (
              <option key={c.id} value={c.id}>
                {c.country_name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={updating}>
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default RegisterUserProfile;
