import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setCredentials({ ...credentials, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = credentials;

    if (!role) {
      alert('Please select a role before logging in.');
      return;
    }

    try {
      const response = await AxiosInstance.post('/login', {
        email,
        password,
        role,
      });

      const { access_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'user') {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p>Please login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'hide' : 'show'}
            </button>
          </div>

          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={credentials.role === 'user'}
                onChange={() => handleRoleChange('user')}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={credentials.role === 'admin'}
                onChange={() => handleRoleChange('admin')}
              />
              Admin
            </label>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default Login;
