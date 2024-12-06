import "../styles/About.css";

const About = () => {
    const teamMembers = [
        { id: 1, name: "Mahmoud Ibrahim", role: "Founder & Chief Executive Officer", image: "/Mahmoud.jpeg", bio: "Leads the team by setting the vision, strategy, and overall direction for the project. Ensures the team stays aligned with goals and delivers quality results." },
        { id: 2, name: "Ahmed Koushen", role: "Chief Technical Officer", image: "/Talaat.jpeg", bio: "Manages the technical development of the website, including system architecture, coding, and integrating modern technologies for a seamless user experience." },
        { id: 3, name: "Abdelrahman Elawwa", role: "Chief Marketing Officer", image: "/Awwa.jpeg", bio: "Develops and implements marketing strategies to promote the website. Focuses on audience engagement and creating impactful campaigns to increase visibility." },
        { id: 4, name: "Shahd Selim", role: "Chief Operating Officer", image: "Shahd.jpeg", bio: "Coordinates daily operations and ensures tasks are completed efficiently. Manages timelines, workflows, and team collaboration to deliver the project on schedule." },
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
