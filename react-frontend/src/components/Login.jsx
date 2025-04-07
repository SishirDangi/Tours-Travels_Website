import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(null); 

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select User or Admin before logging in.");
      return;
    }

    console.log("Email:", email, "Password:", password, "Role:", role);

    // Redirect based on role
    if (role === "user") {
      navigate("/user-login");
    } else if (role === "admin") {
      navigate("/admin-login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>

          <p className="or-text">Login as</p>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn ${role === "user" ? "selected" : ""}`}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              type="button"
              className={`role-btn ${role === "admin" ? "selected" : ""}`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="/" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <p> or </p>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
