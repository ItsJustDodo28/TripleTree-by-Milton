import { useParams } from "react-router-dom";
import "../styles/RoomDetail.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const RoomDetail = (props) => {
    const room = props.room;

    //const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const handleConfirmBooking = () => {
        setShowPopup(true); // Show the popup
    };

    // Close Popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleContinue = () => {
        props.selectRoom(room)
        handleClosePopup();
    };

    if (!room) {
        return <div>Room not found</div>;
    }

    return (
        <div className="room-detail-page">
            <h1>{room.name}</h1>
            <img src={room.image} alt={room.name} className="room-image-detail" />
            <p>{room.description}</p>
            {/*<p className="room-price">Price: ${price.toFixed(2)} / night</p>*/}
            <ul className="features-list">
                {room.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>


            <button className="book-now-button" onClick={handleConfirmBooking}>
                Select
            </button>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4 style={{ margin: '4em' }}>Do you want to select this room?</h4>
                        <div className="popup-actions">
                            <button className="back-button" onClick={handleClosePopup}>
                                Back
                            </button>
                            <button className="continue-button" onClick={handleContinue}>
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetail;