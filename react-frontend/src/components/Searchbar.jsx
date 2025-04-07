import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css"; // Import the CSS file for custom styles

export default function SearchBar() {
  const [category, setCategory] = useState("All Categories");
  const [destination, setDestination] = useState("Any Destinations");
  const [sortBy, setSortBy] = useState("Sort By Latest First");

  return (
    <div className="search-container">
      {/* Category Dropdown */}
      <select
        className="dropdown"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>All Categories</option>
        <option>Adventure</option>
        <option>Nature</option>
        <option>Culture</option>
      </select>

      {/* Destination Dropdown */}
      <select
        className="dropdown"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      >
        <option>Any Destinations</option>
        <option>Europe</option>
        <option>Asia</option>
        <option>America</option>
      </select>

      {/* Sort Dropdown */}
      <select
        className="dropdown"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option>Sort By Latest First</option>
        <option>Sort By Popularity</option>
        <option>Sort By Price</option>
      </select>

      {/* Search Button */}
      <button className="search-button">
        <span>Search&nbsp; </span>
        <FaSearch />
      </button>
    </div>
  );
}
