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
                <p>At TripleTree by Milton, we are dedicated to redefining hospitality through exceptional service, luxurious accommodations, and unforgettable experiences. With locations in some of the most beautiful destinations, we offer a perfect blend of comfort, relaxation, and adventure, ensuring every guest feels valued and cared for.</p>
            </section>

            {/* Mission Statement */}
            <section className="about-mission">
                <h2>Our Mission</h2>
                <p>
                Our mission is to provide unparalleled hospitality by delivering exceptional service, creating memorable experiences, and offering luxurious comfort. At TripleTree by Milton, we are committed to exceeding guest expectations and making every stay extraordinary.
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
                Founded in 2024, TripleTree by Milton has become a symbol of luxury hospitality in Egypt. We combine world-class comfort, exciting activities, and family-friendly services to create unforgettable experiences. Whether you seek relaxation or adventure, TripleTree by Milton ensures excellence in every stay.
                </p>
            </section>
        </div>
    );
};

export default About;
