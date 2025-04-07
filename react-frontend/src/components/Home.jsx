import React from "react";
import "./Home.css";
import SearchBar from "./Searchbar";
import AboutUs from "./AboutUs";
import Footer from "./Footer";
import Whychooseus from "./Whychooseus";

const Home = () => {
  return (
    <div>
      <div className="home-container">
        <div className="Explore">
          <h1>Explore Nepal</h1>
          <h2 className="togo">Where do you want to go?</h2>
          <h3>Search Your Location</h3>
          <div className="searchbar">
            <SearchBar />
          </div>
        </div>
      </div>
      <div>
        <AboutUs />
      </div>
      <div>
        <Whychooseus/>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
