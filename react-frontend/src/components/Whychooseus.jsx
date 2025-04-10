import React from "react";
import { FaStar, FaMapMarkedAlt, FaSuitcase, FaMoneyBillAlt, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
import "./Whychooseus.css";

const Whychooseus = () => {
  const reasons = [
    {
      title: "Trusted by Thousands",
      description: "With years of experience, Yatra Nepal has served thousands of happy travelers across Nepal.",
      icon: <FaStar />,
    },
    {
      title: "Expert Local Guides",
      description: "Our friendly and knowledgeable local guides ensure you get the most authentic experiences.",
      icon: <FaMapMarkedAlt />,
    },
    {
      title: "Customizable Packages",
      description: "We offer flexible and tailor-made tour packages to suit your preferences and budget.",
      icon: <FaSuitcase />,
    },
    {
      title: "Affordable Prices",
      description: "Explore Nepal without breaking the bank — we offer competitive and transparent pricing.",
      icon: <FaMoneyBillAlt />,
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is always available to help before, during, and after your trip.",
      icon: <FaPhoneAlt />,
    },
    {
      title: "Safety First",
      description: "Your safety is our priority — we partner with certified operators and follow strict safety protocols.",
      icon: <FaShieldAlt />,
    },
  ];

  return (
    <section className="why-container">
      <h1 className="why-title">Why Choose Yatra Nepal?</h1>
      <p className="why-subtitle">Your perfect travel partner across Nepal</p>
      <div className="reasons-grid">
        {reasons.map((reason, index) => (
          <div key={index} className="reason-card">
            <div className="icon">{reason.icon}</div>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Whychooseus;
