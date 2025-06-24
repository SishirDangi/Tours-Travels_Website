import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import AboutUs from "./AboutUs";
import Footer from "./Footer";
import Whychooseus from "./Whychooseus";
import Sitemap from "./Sitemap";
import ContactInfo from "./ContactInfo";

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const BASE_URL = "http://127.0.0.1:8001/api";

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/home-page-details`);
        setPhotos(res.data);
      } catch (err) {
        console.error("Failed to fetch photos", err);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 14000);

    return () => clearInterval(interval);
  }, [photos]);

  useEffect(() => {
    if (photos.length === 0) return;

    const title = photos[currentIndex]?.title || ""; 
    setDisplayedTitle("");
    let index = 0;

    const interval = setInterval(() => {
      if (index <= title.length) {
        setDisplayedTitle(title.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 7000 / title.length);

    return () => clearInterval(interval);
  }, [currentIndex, photos]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };
  
  return (
    <>
      <div className="home-slideshow">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`home-slide ${index === currentIndex ? "active" : ""}`}
            style={{
              backgroundImage: `url(http://127.0.0.1:8001/storage/${photo.image_path})`,
            }}
          >
            <div className="home-slide-content">
              <h1>{displayedTitle}</h1>
            </div>
          </div>
        ))}

        <button className="prev-button" onClick={handlePrevious}>
          &#10094;
        </button>
        <button className="next-button" onClick={handleNext}>
          &#10095;
        </button>

        <div className="home-dots">
          {photos.slice(0, 5).map((_, index) => (
            <span
              key={index}
              className={`home-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>

      <AboutUs />
      <Whychooseus />
      <ContactInfo />
      <Sitemap />
      <Footer />
    </>
  );
};

export default Home;
