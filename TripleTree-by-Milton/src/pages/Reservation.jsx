import { useState } from 'react';
import '../styles/Reservation.css';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const rooms = [
    { id: 1, name: 'Single Room', description: 'A compact room with a single bed, perfect for solo travelers. Includes basic amenities.', price: '$60/night', image: '/single.jpg' },
    { id: 2, name: 'Double Room', description: 'A room with one double bed, ideal for two guests. Includes essential amenities.', price: '$100/night', image: '/double.jpg' },
    { id: 3, name: 'Twin Room', description: 'A room with two single beds, great for friends or colleagues. Standard amenities included.', price: '$150/night', image: '/twin.jpg'  },
    { id: 4, name: 'King Room', description: 'A spacious room with a king-size bed and modern comforts, perfect for extra relaxation.', price: '$300/night', image: '/king.jpg'  },
    { id: 5, name: 'Queen Room', description: 'A cozy room with a queen-size bed, ideal for couples or solo travelers seeking comfort.', price: '$450/night', image: '/queen.jpg'  },
    { id: 6, name: 'Suite', description: 'A luxurious space with separate living areas and premium amenities for a special stay.', price: '$700/night', image: '/suite.jpg'  },

];

const ResPage = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    const navigate = useNavigate();

    const location = useLocation();
    const handleCardClick = (room) => {
        if (room === selectedRoom) return; // Do nothing if the same room is clicked
        if(room) {
            setSelectedRoom(room);
            navigate(`${location.pathname}#${room.id}`); // Navigate to the current URL with the room ID
        }else{
            setSelectedRoom(null);
            navigate(`${location.pathname}`); // Navigate to the current URL with the room ID
        }
    }

    const handleBookNow = (roomId) => {
        navigate(`/room/${roomId}`); // Navigate to the Room Detail page with the room ID
    };

    return (
        <div className="reservation-page">
            <h1 className="reservation-title">Hotel Room Catalogue</h1>
            <div className="reservation-content">
                <div className={`reservation-room-grid ${selectedRoom ? 'shift-left' : ''}`}>
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="reservation-room-card"
                            onClick={() => handleCardClick(room)}
                        >
                            <img src={room.image} alt={room.name} className="reservation-room-image" />
                            <div className="reservation-room-details">
                                <h2>{room.name}</h2>
                                <p>{room.description}</p>
                                <p className="reservation-price">{room.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedRoom && (
                    <div className="reservation-details-container">
                        <button className="reservation-back" onClick={() => handleCardClick(null)}>Back</button>
                        <img
                            src={selectedRoom.image}
                            alt={selectedRoom.name}
                            className="reservation-detail-image"
                        />
                        <div className="reservation-info">
                            <h2>{selectedRoom.name}</h2>
                            <p>{selectedRoom.description}</p>
                            <p className="reservation-price">{selectedRoom.price}</p>
                            {/*< to=`/room/${roomId}`>*/}
                            <button className="reservation-book-now-button"  onClick={() => handleBookNow(selectedRoom.id)}  > Book Now</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResPage;