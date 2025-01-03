import { useEffect, useState } from 'react';
import '../styles/Reservation.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Booking from '../components/booking';
import RoomDetail from './RoomDetail';



const ResPage = (props) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomsx, setRoomsx] = useState([{ id: null, name: null, addons: null, price: null, guests: null }]);
    const [roomn, setRoomn] = useState(1);
    const [guestn, setGuestn] = useState(1);
    const [currentItem, setCurrentItem] = useState(0);
    const [rooms, setRooms] = useState([]);

    const navigate = useNavigate();

    const location = useLocation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/ROOM`);
                const result = await response.json();
                setRooms(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    const handleCardClick = (room) => {
        if (room === selectedRoom) return; // Do nothing if the same room is clicked
        if (room) {
            setSelectedRoom(room);
            navigate(`${location.pathname}#${room['room_id']}`); // Navigate to the current URL with the room ID
        } else {
            setSelectedRoom(null);
            navigate(`${location.pathname}`); // Navigate to the current URL with the room ID
        }
    }

    useEffect(() => {
        // Side effect logic here
        if (roomsx.length > roomn) {
            setRoomsx(roomsx.slice(0, -(roomsx.length - roomn)));
        } else if (roomsx.length < roomn) {
            let x = { id: null, name: null, addons: null, price: null, guests: null };
            setRoomsx([...roomsx, ...Array(roomn - roomsx.length).fill(x)]);
            console.log(roomsx)
        }

        return () => {
            // Cleanup logic here

        };
    }, [roomn]); // Dependency array


    const handleBookNow = (roomId) => {
        navigate(`/room/${roomId}`); // Navigate to the Room Detail page with the room ID
    };


    const selectRoom = (selected) => {
        let x = roomsx;
        x[currentItem].id = selected.room.id;
        x[currentItem].name = selected.room.name;
        x[currentItem].addons = [selected.selectedOption, ...selected.addons];
        x[currentItem].price = selected.totalPrice;
        x[currentItem].guests = 2;

        setRoomsx(x);
        console.log(roomsx);
        setCurrentItem(currentItem + 1);

        if (currentItem >= roomn - 1) {
            handleContinueToPayment();
        }
    }

    const handleContinueToPayment = () => {

        let total = 0;
        for (let i = 0; i < roomsx.length; i++) {
            total += roomsx[i].price;
        }
        //setTotal(x);


        navigate("/payment", {
            state: {
                roomsx,
                total
            }
        });
    }

    return (
        <div className="reservation-page">
            <Booking setroomn={setRoomn} setguestn={setGuestn} />
            <p>Rooms:</p>
            <div className='shopping-cart' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {roomsx.map((roomx, index) => (
                    <div key={index} className='cart-room' style={{ margin: '0.1em', padding: '1em', background: 'white', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)', borderRadius: '7px' }}>
                        <p>room: {roomx.name}</p>
                        <p>features: {roomx.addons}</p>
                        <p>price: {roomx.price}</p>
                        <p>guests: {roomx.guests}</p>
                    </div>
                ))}
            </div>
            <h1 className="reservation-title">Hotel Room Catalogue</h1>
            <div className="reservation-content">
                <div className={`reservation-room-grid ${selectedRoom ? 'shift-left' : ''}`}>
                    {rooms.map((room) => (
                        <div
                            key={room.room_id}
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
                        <RoomDetail room={selectedRoom} selectRoom={selectRoom} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResPage;