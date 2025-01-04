import { useState } from "react";
import "../styles/CustomerSupport.css";

const faqSections = [
  {
    title: "Your Account",
    items: ["Signing in", "Managing your account"],
  },
  {
    title: "TripleTree Elite",
    items: ["Joining TripleTree Elite", "Member status", "Member benefits"],
  },
  {
    title: "Reservations",
    items: ["Cancelling a stay", "Changing a stay", "Payments, refunds, and receipts"],
  },
  {
    title: "Hotel Information",
    items: ["Amenities & services", "Health & safety", "Parking & transportation"],
  },
  {
    title: "Check-in / Check-out",
    items: ["Digital Key", "Checking in", "Checking out"],
  },
  {
    title: "Elite Points",
    items: ["Your Points balance", "Earning Points", "Booking with Points"],
  },
];

const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    topic: "",
    fullName: "",
    phone: "",
    email: "",
    hotelName: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "82769436-cf7d-41b2-ada4-58c46028f651", 
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({
          topic: "",
          fullName: "",
          phone: "",
          email: "",
          hotelName: "",
          message: "",
        });
      } else {
        setErrorMessage(result.message || "Failed to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-support">
      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-header">
          <h1>How can we help?</h1>
          <div className="faq-search">
            <input type="text" placeholder="I want to know..." />
            <button className="search-button">Search</button>
          </div>
        </div>
        <div className="faq-grid">
          {faqSections.map((section, index) => (
            <div key={index} className="faq-card">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
              <p>
                <a href="#">More Articles...</a>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <h2>Contact Us</h2>
        <p>
          Didn’t find what you were looking for? Fill out the form below, and our support team will
          get back to you.
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>What is your question or comment about?</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
            >
              <option value="">Select one</option>
              <option value="Reservations">Reservations</option>
              <option value="Membership">Membership</option>
              <option value="Points & Rewards">Points & Rewards</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="form-group">
              <label>Hotel Name (Optional)</label>
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleInputChange}
                placeholder="Enter hotel name"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Your Question or Comment</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your question or comment"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </section>
    </div>
  );
};

export default CustomerSupport;
