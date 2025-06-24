import React, { useState, useEffect } from "react";
import "./PrivacyPolicy.css";
import { FaChevronRight } from "react-icons/fa";

const sections = [
  {
    title: "INFORMATION COLLECTION",
    content:
      "We collect personal information such as your name, email, phone number, and payment details when you make a booking or register on our website.",
  },
  {
    title: "USE OF INFORMATION",
    content:
      "The information we collect is used to process bookings, provide customer support, send updates, and improve our services.",
  },
  {
    title: "SHARING INFORMATION",
    content:
      "We do not sell or rent your personal information. We may share it with trusted third parties who assist us in operating our website and conducting our business, as long as those parties agree to keep the information confidential.",
  },
  {
    title: "DATA SECURITY",
    content:
      "We implement various security measures to ensure the safety of your personal information. All sensitive data is encrypted and transmitted securely.",
  },
  {
    title: "COOKIES",
    content:
      "Our website uses cookies to improve user experience. Cookies help us understand user behavior and preferences to provide a better experience.",
  },
  {
    title: "YOUR RIGHTS",
    content:
      "You have the right to access, modify, or delete your personal data. If you wish to update your information or remove yourself from our database, contact us directly.",
  },
  {
    title: "CHANGES TO THIS POLICY",
    content:
      "We may update our privacy policy from time to time. Any changes will be posted on this page with a revised date at the top.",
  },
  {
    title: "CONTACT US",
    content:
      "If you have any questions regarding this privacy policy, you can contact us through the contact form on our website or via our support email.",
  },
];

const PrivacyPolicy = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <>
      <div className="privacy-wrapper">
        <h1 className="page-title">Privacy Policy</h1>
        {sections.map((section, index) => (
          <div key={index} className="accordion-section">
            <div
              className={`accordion-header ${index === activeIndex ? "active" : ""}`}
              onClick={() => toggleSection(index)}
            >
              <FaChevronRight
                className={`chevron-icon ${index === activeIndex ? "rotate" : ""}`}
              />
              <span className="accordion-title">{section.title}</span>
            </div>
            {index === activeIndex && (
              <div className="accordion-content">
                <p>{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
  
    </>
  );
};

export default PrivacyPolicy;
