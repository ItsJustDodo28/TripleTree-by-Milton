import { useParams } from "react-router-dom";
import "../styles/RoomDetail.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { Link } from "react-router-dom";

const rooms = [
    { id: 1, name: "Deluxe Room", description: "A luxurious room with a king-sized bed.", basePrice: 200, image: "https://via.placeholder.com/300", features: ["Free WiFi", "Air Conditioning", "Room Service"] },
    { id: 2, name: "Standard Room", description: "A comfortable room with a queen-sized bed.", basePrice: 150, image: "https://via.placeholder.com/300", features: ["Free Breakfast", "Flat-Screen TV", "Mini Fridge"] },
    { id: 3, name: "Suite", description: "A spacious suite with a living area.", basePrice: 300, image: "https://via.placeholder.com/300", features: ["Living Area", "Private Balcony", "Luxury Bathroom"] },
];

const RoomDetail = () => {
    var p = useParams();
    const room = rooms.find((room) => room.id === parseInt(p.id));
    console.log(p.id);
    
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("plain");
    const [price, setPrice] = useState(room.basePrice);
    const [showPopup, setShowPopup] = useState(false);
    const [addons, setAddons] = useState([]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        switch (option) {
            case "plain":
                setPrice(room.basePrice);
                break;
            case "breakfast":
                setPrice(room.basePrice * 1.1); // Adds 10% for breakfast
                break;
            case "ocean-view":
                setPrice(room.basePrice * 1.1); // Adds 10% for ocean view
                break;
            case "breakfast-ocean-view":
                setPrice(room.basePrice * 1.15); // Adds 15% for both
                break;
            default:
                setPrice(room.basePrice);
        }
    };
    const toggleAddon = (addon) => {
        if (addons.includes(addon)) {
            setAddons(addons.filter((a) => a !== addon));
        } else {
            setAddons([...addons, addon]);
        }
    };

    const handleConfirmBooking = () => {
        setShowPopup(true); // Show the popup
    };

    // Close Popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleContinueToPayment = () => {
        navigate("/payment", {
            state: {
                room,
                selectedOption,
                addons,
                totalPrice: price + addons.reduce((acc, addon) => acc + (addon === "Spa Package" ? 50 : addon === "Airport Transfers" ? 30 : addon === "Meal Package" ? 40 : 0), 0),
            },
        });
    };

    if (!room) {
        return <div>Room not found</div>;
    }

    return (
        <div className="room-detail-page">
            <h1>{room.name}</h1>
            <img src={room.image} alt={room.name} className="room-image-detail" />
            <p>{room.description}</p>
            <p className="room-price">Price: ${price.toFixed(2)} / night</p>
            <ul className="features-list">
                {room.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>

            {/* Room Options Section */}
            <div className="room-options">
                <h2>Select Your Option</h2>
                <div className="options">
                    <button
                        className={selectedOption === "plain" ? "active" : ""}
                        onClick={() => handleOptionChange("plain")}
                    >
                        Plain Room (${room.basePrice})
                    </button>
                    <button
                        className={selectedOption === "breakfast" ? "active" : ""}
                        onClick={() => handleOptionChange("breakfast")}
                    >
                        Room + Breakfast (+10%)
                    </button>
                    <button
                        className={selectedOption === "ocean-view" ? "active" : ""}
                        onClick={() => handleOptionChange("ocean-view")}
                    >
                        Room + Ocean View (+10%)
                    </button>
                    <button
                        className={selectedOption === "breakfast-ocean-view" ? "active" : ""}
                        onClick={() => handleOptionChange("breakfast-ocean-view")}
                    >
                        Room + Breakfast + Ocean View (+15%)
                    </button>
                </div>
            </div>

            <button className="book-now-button" onClick={handleConfirmBooking}>
                Confirm Booking
            </button>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Enhance Your Stay</h2>
                        <ul className="extras-list">
                            <li>
                                <label>
                                    <input type="checkbox" onChange={() => toggleAddon("Spa Package")}/>
                                    Spa Package (+$50)
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="checkbox" onChange={() => toggleAddon("Airport Transfers")} />
                                    Airport Transfers (+$30)
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="checkbox" onChange={() => toggleAddon("Meal Package")} />
                                    Meal Package (+$40)
                                </label>
                            </li>
                        </ul>
                        <div className="popup-actions">
                            <button className="back-button" onClick={handleClosePopup}>
                                Back to Options
                            </button>
                            <button className="continue-button" onClick={handleContinueToPayment}>
                                Continue to Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetail;