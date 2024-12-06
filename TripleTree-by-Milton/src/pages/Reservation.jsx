import { useState } from 'react';
import '../styles/Reservation.css';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const rooms = [
    { id: 1, name: 'Deluxe Room', description: 'A luxurious room with a king-sized bed.', price: '$200/night', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'Standard Room', description: 'A comfortable room with a queen-sized bed.', price: '$150/night', image: 'https://via.placeholder.com/300' },
    { id: 3, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 4, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 5, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 6, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 7, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 8, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 9, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 10, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },
    { id: 11, name: 'Suite', description: 'A spacious suite with a living area.', price: '$300/night' },

];

const ResPage = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    const navigate = useNavigate();

    const handleCardClick = (room) => {
        setSelectedRoom(room);
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