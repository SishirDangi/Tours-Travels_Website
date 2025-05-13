import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";
import logo from "../assets/yatra-nepal-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false); // State to handle dropdown visibility

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Yatra Nepal" className="logo" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/destinations" onClick={() => setIsOpen(false)}>Destinations</Link></li>
          <li><Link to="/packages" onClick={() => setIsOpen(false)}>Packages</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link></li>
          <li><Link to="/enquiry" onClick={() => setIsOpen(false)}>Enquiry Now</Link></li>

          {/* Login Dropdown */}
          <li className="login-menu" onClick={() => setLoginMenuOpen(!loginMenuOpen)}>
            Login
            {loginMenuOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/user/login" onClick={() => setIsOpen(false)}>User Login</Link></li>
                <li><Link to="/admin/login" onClick={() => setIsOpen(false)}>Admin Login</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/register" onClick={() => setIsOpen(false)}>Register</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="hamburger">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
