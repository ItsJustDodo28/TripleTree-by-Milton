import "../styles/About.css";

const About = () => {
    const teamMembers = [
        { id: 1, name: "Mahmoud Ibrahim", role: "Founder & Chief Executive Officer", image: "https://via.placeholder.com/150", bio: "Jane leads the team with a passion for excellence and innovation." },
        { id: 2, name: "Ahmed Koushen", role: "Chief Technical Officer", image: "https://via.placeholder.com/150", bio: "Emily crafts designs that bring our vision to life." },
        { id: 3, name: "Abdelrahman Elawwa", role: "Chief Marketing Officer", image: "https://via.placeholder.com/150", bio: "John creates impactful campaigns to connect with our audience." },
        { id: 4, name: "Shahd Selim", role: "Chief Operating Officer", image: "https://via.placeholder.com/150", bio: "Emily crafts designs that bring our vision to life." },
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <h1>About Us</h1>
                <p>We strive to deliver the best experiences for our guests, combining luxury and comfort with world-class service.</p>
            </section>

            {/* Mission Statement */}
            <section className="about-mission">
                <h2>Our Mission</h2>
                <p>
                    At TripleTree By Milton, our mission is to redefine hospitality by creating unforgettable experiences that exceed expectations. 
                    We are committed to excellence in every aspect of our service.
                </p>
            </section>

            {/* Team Section */}
            <section className="about-team">
                <h2>Meet Our Team</h2>
                <div className="about-team-grid">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="about-team-member">
                            <img src={member.image} alt={member.name} className="about-team-image" />
                            <h3>{member.name}</h3>
                            <p className="about-role">{member.role}</p>
                            <p className="about-bio">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* History Section */}
            <section className="about-history">
                <h2>Our Journey</h2>
                <p>
                    Established in 2024, TripleTree By Milton has grown from a single luxury resort into a symbol of excellence in the hospitality industry. 
                    We’ve welcomed guests from around the world, creating cherished memories along the way.
                </p>
            </section>
        </div>
    );
};

export default About;
