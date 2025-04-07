import React, { useState } from "react";
import "./TermsAndConditions.css";
import { FaChevronRight } from "react-icons/fa";
import Footer from "./Footer";

const sections = [
  {
    title: "GENERAL BOOKING CONDITIONS",
    content:
      "By booking with us, you agree to adhere to the terms and conditions outlined here. It is your responsibility to ensure that all the details of your booking are correct.",
  },
  {
    title: "MODE OF PAYMENT",
    content:
      "Payment for bookings must be made in full at the time of booking unless otherwise agreed. We accept various payment methods including credit cards, bank transfers, and online payment options.",
  },
  {
    title: "RISK AND LIABILITIES",
    content:
      "We take reasonable measures to ensure your safety during the trip. However, we are not responsible for any loss, injury, or damage that may occur during the tour.",
  },
  {
    title: "LAST MINUTE BOOKING",
    content:
      "Bookings made within 24 hours of the tour may be subject to additional charges or availability limitations. Please contact us for more details.",
  },
  {
    title: "POSTPONE THE TRIP",
    content:
      "If you wish to postpone your trip, please notify us at least 72 hours in advance. Postponement requests are subject to availability and may incur extra fees.",
  },
  {
    title: "TRIP CANCELLATION POLICY",
    content:
      "Cancellations made at least 7 days before the trip will receive a full refund. Cancellations made less than 7 days in advance may incur cancellation charges.",
  },
  {
    title: "INCOMPLETE TOUR",
    content:
      "If a tour is incomplete due to reasons within our control, we will provide compensation or reschedule the tour at no additional charge.",
  },
  {
    title: "UNFORESEEN CIRCUMSTANCES",
    content:
      "We are not liable for cancellations, delays, or disruptions caused by unforeseen circumstances such as natural disasters, strikes, or other force majeure events.",
  },
  {
    title: "PRICE CHANGING",
    content:
      "Prices may change depending on the availability and demand. We will notify you of any changes before confirming your booking.",
  },
  {
    title: "TRAVEL INSURANCE",
    content:
      "Travel insurance is recommended but not included in the price of your trip. We strongly advise you to purchase insurance for coverage on trip cancellations, lost luggage, and medical emergencies.",
  },
  {
    title: "FLIGHT DELAY/CANCELLATION",
    content:
      "We are not responsible for flight delays or cancellations. Please check with your airline for any changes to your flight schedule.",
  },
  {
    title: "DURING THE TOUR",
    content:
      "You agree to follow all instructions given by our tour guides. Any behavior that disrupts the tour or endangers others may result in removal from the tour.",
  },
  {
    title: "WARNING",
    content:
      "Our terms and conditions apply only if you book your trip directly with us. If you book your trip with us through any agents or third parties, you are responsible for the terms and conditions of your travel.",
  },
];

const TermsAndConditions = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <>
    <div className="terms-wrapper">
      <h1 className="page-title">Terms and Conditions</h1>
      {sections.map((section, index) => (
        <div key={index} className="accordion-section">
          <div
            className={`accordion-header ${
              index === activeIndex ? "active" : ""
            }`}
            onClick={() => toggleSection(index)}
          >
            <FaChevronRight
              className={`chevron-icon ${
                index === activeIndex ? "rotate" : ""
              }`}
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
    <div>
        <Footer/>
    </div>    
    
    </>
  );
};

export default TermsAndConditions;
