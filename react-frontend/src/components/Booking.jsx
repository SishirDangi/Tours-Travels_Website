import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Booking.module.css";

const Booking = () => {
  const { package_id } = useParams();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/packages/${package_id}`)
      .then((response) => response.json())
      .then((data) => setPackageData(data))
      .catch((error) => console.error("Error fetching package data:", error));
  }, [package_id]);

  if (!packageData) {
    return <p className={styles.loadingText}>Loading package information...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Booking Details</h2>
      <div className={styles.bookingForm}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <h3 className={styles.subHeading}>Contact Details</h3>
          <div className={styles.inputGroup}>
            <select className={styles.inputField}>
              <option>Country Code</option>
            </select>
            <input type="text" placeholder="Contact Number" className={styles.inputField} />
          </div>
          <input type="email" placeholder="Email Address" className={styles.inputFull} />
          
          <h3 className={styles.subHeading}>Passenger Details</h3>
          <div className={styles.inputGroup}>
            <select className={styles.inputField}>
              <option>Title</option>
            </select>
            <input type="text" placeholder="First Name" className={styles.inputField} />
          </div>
          <input type="text" placeholder="Last Name" className={styles.inputFull} />
          <div className={styles.inputGroup}>
            <input type="date" className={styles.inputField} />
            <select className={styles.inputField}>
              <option>Select Country</option>
            </select>
          </div>
          
          <h3 className={styles.subHeading}>Number of Person</h3>
          <input type="text" placeholder="1 Person" className={styles.inputFull} />
          
          <h3 className={styles.subHeading}>Tour Location</h3>
          <input type="text" value={packageData.package_name} className={styles.inputFull} readOnly />
          
          <h3 className={styles.subHeading}>Tour Date</h3>
          <input type="date" className={styles.inputFull} />
        </div>
        
        {/* Right Section */}
        <div className={styles.rightSection}>
          <h3 className={styles.summaryHeading}>Booking Summary</h3>
          <div className={styles.summaryBox}>
            <p>{packageData.package_name}</p>
            <p>{packageData.package_date}</p>
            <p>{packageData.package_location}</p>
            <div className={styles.summaryDetails}>
              <p>TOUR PRICE: ${packageData.package_price}</p>
              <p>AMOUNT x 1: ${packageData.package_price}</p>
              <p>VAT (13%): ${(packageData.package_price * 0.13).toFixed(2)}</p>
              <p>DISCOUNT: $0.00</p>
              <p className={styles.totalPrice}>TOTAL PRICE: ${(packageData.package_price * 1.13).toFixed(2)}</p>
            </div>
          </div>
          <button className={styles.bookButton}>Book This Tour</button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
