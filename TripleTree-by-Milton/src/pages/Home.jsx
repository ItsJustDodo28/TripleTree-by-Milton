import "../styles/Home.css";
import background from "/background.webp";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Booking from "../components/booking";


const images = [
  "/image 1.webp",
  "/image 2.webp",
  "/image 3.webp",
  "/Cosy.jpg",
  "/double.jpg",
  "/Mountain.jpg",
  "/Beach-Side.jpg",
  "/queen.jpg",
  "/background.webp",
  "/king.jpg",

];

function HomePage() {
  const nav = useNavigate();

  // Calculate the number of nights


  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="homepage">
      <header
        className="hero"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="overlay">
          <div className="hero-content">
            <br /><br /><br />

            <br /><br /><br />
            <h1 className="hero-title">TripleTree By Milton</h1>
            <div className="hero-subtitle">
              <p>

                <span>
                  <img src="location.png" height={25} style={{ marginRight: '0.5em', top: '0.20em', position: 'relative' }} />
                  All Across Egypt
                </span>
                <br /><br />
                <span className="rating"><img src="/stars.png" height={30} /></span>
              </p>
            </div>
            <div className="features-icons">
              <div className="feature">
                <span><img src="/food.png" height={50} /></span>
                <p>All Inclusive</p>
              </div>
              <div className="feature">
                <span><img src="/kids.png" height={50} /></span>
                <p>Kids Club</p>
              </div>
              <div className="feature">
                <span><img src="/entertainment.png" height={50} /></span>
                <p>Entertainment</p>
              </div>
              <div className="feature">
                <span><img src="/gym.png" height={50} /></span>
                <p>Fitness</p>
              </div>
              <div className="feature">
                <span><img src="/wellness.png" height={50} /></span>
                <p>Wellness</p>
              </div>
              <div className="feature">
                <span><img src="/beach.png" height={50} /></span>
                <p>Beach</p>
              </div>
              <div className="feature">
                <span><img src="/water-sp.png" height={50} /></span>
                <p>Watersports</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <button onClick={() => { nav('/Reservations') }}>
        BOOK NOW!
      </button>
      <section className="welcome-carousel-section">
        <div className="welcome-message">
          <h2>Welcome to TripleTree By Milton</h2>
          <p>
            Discover luxury and comfort with TripleTree by Milton, where hospitality meets elegance. With exceptional service and unique experiences, our hotels provide the perfect escape for relaxation, adventure, or business. Located in stunning destinations across Egypt, we blend modern amenities with warm hospitality to create unforgettable stays for every guest.
          </p>
          <p className="check-in-out">
            <span>Check-in - 2:00 PM</span>
            <span>Check-out - 12:00 PM</span>
          </p>
        </div>
        <div className="carousel">
          <button className="carousel-btn prev" onClick={() => { handlePrev(); nav(); }}>
            &#10094;
          </button>
          <div className="carousel-image-container">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="carousel-image"
            />
          </div>
          <button className="carousel-btn next" onClick={() => { handleNext(); nav(); }}>
            &#10095;
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
