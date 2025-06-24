import React, { useState, useEffect } from "react";
import "./Faqs.css";
import { FaChevronRight } from "react-icons/fa";

const faqList = [
  {
    question: "How do I book a tour?",
    answer:
      "You can book a tour directly through our website by selecting your desired package, choosing a date, and completing the booking form with your details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept payments via credit/debit cards, bank transfers and secure online payment gateways.",
  },
  {
    question: "Can I customize my tour package?",
    answer:
      "Yes! We offer customizable packages. Contact our support team to tailor the tour to your preferences.",
  },
  {
    question: "Is travel insurance included in the package?",
    answer:
      "No, travel insurance is not included. We highly recommend purchasing travel insurance separately for your safety.",
  },
  {
    question: "What happens in case of bad weather or unforeseen circumstances?",
    answer:
      "In such cases, we try to reschedule your tour or provide alternatives. If not possible, refunds are processed according to our terms.",
  },
  {
    question: "Do you offer group discounts?",
    answer:
      "Yes, we provide special discounts for groups. Please contact us with your group size for details.",
  },
  {
    question: "Can I change my travel dates after booking?",
    answer:
      "Yes, date changes are allowed up to 24 hour after booking, subject to availability.",
  },
];

const Faqss = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <>
      <div className="faq-wrapper">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        {faqList.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className={`faq-question ${index === activeIndex ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <FaChevronRight
                className={`chevron-icon ${index === activeIndex ? "rotate" : ""}`}
              />
              {faq.question}
            </div>
            {index === activeIndex && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Faqss;
