import React from "react";
import "./Footer.css"; 
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Yatra Nepal */}
        <div className="footer-section about">
          <h2>About Yatra Nepal</h2>
          <p>
            A travel company with an objective to bring you the unexplored Nepal. <br />
            Dev Reg No: 110336/070/071 <br />
            Trekking Agency license no: 2605/068 <br />
            Travel Agency license no: 3289
          </p>
          <h3>Stay Connected</h3>
          <div className="social-icons">
            <Link to="#" target="_blank" rel="noopener noreferrer"><FaFacebookF /></Link>
            <Link to="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></Link>
            <Link to="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="#">Blogs</Link></li>
            <li><Link to="/bookingpolicy">Booking Policy</Link></li>
            <li><Link to="/sitemap">Sitemap</Link></li>
            <li><Link to="register">Register</Link></li>
            <li><Link to="login">Login</Link></li>
          </ul>
        </div>

        {/* Tour Packages */}
        <div className="footer-section tour-packages">
          <h2>Tour Packages</h2>
          <ul>
            <li><Link to="#">Kathmandu Tour Package</Link></li>
            <li><Link to="#">Bhaktapur Tour Package</Link></li>
            <li><Link to="#">Lalitpur Tour Package</Link></li>
            <li><Link to="#">Nagarkot Tour Package</Link></li>
            <li><Link to="#">Pokhara Tour Package</Link></li>
            <li><Link to="#">Mustang Tour Package</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p><HiOutlineMail /> info@yatranepal.com</p>
          <p><HiOutlinePhone /> +977-9841168611 / 9849007375</p>
          <p><MdLocationOn /> Kathmandu, Nepal</p>
          <Link to="/enquiry" className="enquiry-button">Enquiry Now</Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>Copyright © {currentYear}, Yatra Nepal | All rights reserved</p>
          <div className="footer-links">
            <Link to="/terms">Terms & Condition</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="faqs">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
