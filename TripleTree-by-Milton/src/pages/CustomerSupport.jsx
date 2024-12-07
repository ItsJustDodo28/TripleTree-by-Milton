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
                    Didn’t find what you were looking for? Fill out the form below, and our
                    support team will get back to you.
                </p>
                <form className="contact-form">
                    <div className="form-group">
                        <label>What is your question or comment about?</label>
                        <select>
                            <option>Select one</option>
                            <option>Reservations</option>
                            <option>Membership</option>
                            <option>Points & Rewards</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" placeholder="Enter your phone number" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="Enter your email address" />
                        </div>
                        <div className="form-group">
                            <label>Hotel Name (Optional)</label>
                            <input type="text" placeholder="Enter hotel name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Your Question or Comment</label>
                        <textarea placeholder="Enter your question or comment"></textarea>
                    </div>
                    <div className="form-group">
                        <button className="submit-button">Submit</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CustomerSupport;
