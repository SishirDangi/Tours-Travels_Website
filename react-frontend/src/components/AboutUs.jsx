import React, { useState } from "react";
import "./AboutUs.css"; // Import external CSS

const AboutSection = () => {
  const [showMore, setShowMore] = useState(false);

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="about-container">
      <div className="about-content">
        <h1 className="about-subtitle">About Yatra Nepal</h1>
        <h1 className="about-title">Discover insights about Nepal</h1>
        <p className="about-text">
          Yatra Nepal is a trusted tours and travels company dedicated to showcasing the beauty and culture of Nepal. We specialize in providing unforgettable tour experiences across the country, including popular destinations like Kathmandu, Pokhara, Mustang, Lalitpur, Chitwan, and many more.
        </p>
        <p className="about-text">
          With a strong commitment to customer satisfaction, we ensure fast and excellent services — from personalized tour planning to smooth travel arrangements. Whether you're an adventurer seeking trekking trails or a culture enthusiast exploring heritage sites, Yatra Nepal promises a seamless and memorable journey through the heart of Nepal.
        </p>

        {showMore && (
          <div>
            <p className="about-text">
              Our team of experienced travel experts ensures each tour is perfectly tailored to your interests. We offer customizable packages, local guides, transportation, and accommodation, all handled with professionalism and care.
            </p>
            <p className="about-text">
              Choose Yatra Nepal for your next adventure and experience Nepal's natural wonders, rich traditions, and warm hospitality like never before.
            </p>
          </div>
        )}

        <button className="about-btn" onClick={handleReadMore}>
          {showMore ? "Read less" : "Read more"}
        </button>
      </div>
      <div className="about-images">
        <img src="public/lake.jpg" alt="Beautiful Lake in Nepal" className="image image-top" />
        <img src="/mounteverest.jpg" alt="Mount Everest" className="image image-bottom" />
      </div>
    </section>
  );
};

export default AboutSection;
