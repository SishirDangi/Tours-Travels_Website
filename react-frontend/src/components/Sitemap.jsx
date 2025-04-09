import React from 'react';
import './Sitemap.css'; 

const Sitemap = () => {
  return (
    <div className="sitemap-container">
      <h2 className="sitemap-heading">Our Office Location</h2>
      <div className="map-frame">
        <iframe
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.339991521181!2d85.37041797527993!3d27.705062025974353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b82f5ef06f3%3A0x88f03b23f5e4c76a!2sKausaltar%2C%20Madhyapur%20Thimi%2044600!5e0!3m2!1sen!2snp!4v1712481429825!5m2!1sen!2snp"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Sitemap;
