import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";  // import useNavigate
import './Login.css';

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const navigate = useNavigate();  // initialize navigate

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axios.get("http://localhost:8001/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const response = await axios.post(
        "http://localhost:8001/api/login",
        {
          email,
          password,
          role: "user",
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        sessionStorage.setItem("token", response.data.access_token);

        // Instead of window.open, do this:
        navigate("/registereduserdashboard", { replace: true });  // <-- important

      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tour-container">
      <form onSubmit={handleLogin} className="tour-form">
        <h2 className="tour-title">User Login</h2>

        <div>
          <label className="tour-label">Email:</label>
          <input
            ref={emailRef}
            type="email"
            className="tour-input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="tour-label">Password:</label>
          <div className="tour-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="tour-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        {error && <p className="tour-error">{error}</p>}

        <button type="submit" disabled={isLoading} className="tour-button">
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="tour-links">
          {/* <p>
            Forgot <Link to="/forgot-username">Username</Link> /{" "}
            <Link to="/forgot-password">Password</Link>?
          </p> */}
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
