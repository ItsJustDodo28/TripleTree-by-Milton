import "../styles/Home.css";
import background from "/background.webp";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


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
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(2);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    // Calculate the number of nights
    const calculateNights = () => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const difference = (end - start) / (1000 * 60 * 60 * 24); // Convert ms to days
        return difference > 0 ? difference : 0;
      }
      return 0;
    };
  
    const nights = calculateNights();

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
            <br/><br/><br/>
           
            <br/><br/><br/>
            <h1 className="hero-title">TripleTree By Milton</h1>
            <div className="hero-subtitle">
              <p>

                <span>
                  <img src="location.png" height={25} style={{marginRight:'0.5em', top: '0.20em', position: 'relative'}}/>
                  All Across Egypt
                  </span>
                <br/><br/>
                <span className="rating"><img src="/stars.png" height={30}/></span>
              </p>
            </div>
            <div className="features-icons">
              <div className="feature">
                <span><img src="/food.png" height={50}/></span>
                <p>All Inclusive</p>
              </div>
              <div className="feature">
                <span><img src="/kids.png" height={50}/></span>
                <p>Kids Club</p>
              </div>
              <div className="feature">
                <span><img src="/entertainment.png" height={50}/></span>
                <p>Entertainment</p>
              </div>
              <div className="feature">
                <span><img src="/gym.png" height={50}/></span>
                <p>Fitness</p>
              </div>
              <div className="feature">
                <span><img src="/wellness.png" height={50}/></span>
                <p>Wellness</p>
              </div>
              <div className="feature">
                <span><img src="/beach.png" height={50}/></span>
                <p>Beach</p>
              </div>
              <div className="feature">
                <span><img src="/water-sp.png" height={50}/></span>
                <p>Watersports</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="booking-section">
        <h2 className="booking-title">Book your next ALL Inclusive Collection experience</h2>
        <div className="booking-widget">
          <div className="booking-details">
            <div className="booking-item">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="booking-item">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="booking-item">
              <label>Rooms & Guests</label>
              <p
                onClick={() => {setIsDropdownOpen(!isDropdownOpen); nav('');}}
                className="dropdown-trigger"
              >
                {rooms} room{rooms > 1 ? "s" : ""} - {guests} guest
                {guests > 1 ? "s" : ""}
              </p>
              {isDropdownOpen && (
                <div className="dropdown">
                  <div className="dropdown-item">
                    <label>Rooms:</label>
                    <input
                      type="number"
                      min="1"
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                    />
                  </div>
                  <div className="dropdown-item">
                    <label>Guests:</label>
                    <input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="booking-summary">
            <p className="price">????</p>
            <p className="stay-info">
              {nights || 0} night{nights !== 1 ? "s" : ""} - {guests} guest
              {guests !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="booking-button">Book Now</button>
        </div>
      </section>
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
