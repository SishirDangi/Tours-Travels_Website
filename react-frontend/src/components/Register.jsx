import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (name === 'password' || name === 'password_confirmation') {
      setPasswordsMatch(updatedFormData.password === updatedFormData.password_confirmation);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8001/api/register', formData);
      alert(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Registration error occurred.');
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const verifyData = {
        email: formData.email,
        otp: otp,
        password: formData.password,
      };

      const response = await axios.post('http://localhost:8001/api/verify-otp', verifyData);
      alert(response.data.message);

      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        password: '',
        password_confirmation: '',
      });
      setOtp('');
      setIsOtpSent(false);

      // Redirect user to login page after successful OTP verification
      navigate('/user/login');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'OTP verification failed.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {!isOtpSent ? (
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group half-width">
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
            <div className="form-group half-width">
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

          <div className="form-row">
            <div className="form-group half-width password-group">
              <label className="register-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="register-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            <div className="form-group half-width password-group">
              <label className="register-label">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  className="register-input"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
          </div>

          {!passwordsMatch && (
            <p className="error-message">Passwords do not match.</p>
          )}

          <div className="form-group">
            <button className="register-button" type="submit" disabled={!passwordsMatch}>
              Register
            </button>
          </div>
          <p className="login-link">
            Already have an account? <Link to="/user/login">Login</Link>
          </p>
        </form>
      ) : (
        <form className="register-form" onSubmit={handleOtpSubmit}>
          <div className="form-group">
            <label className="register-label">Enter OTP sent to your email</label>
            <input
              type="text"
              name="otp"
              className="register-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button className="register-button" type="submit">Verify OTP</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
