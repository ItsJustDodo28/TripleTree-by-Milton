import { useEffect, useState } from 'react';
import '../styles/Reservation.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Booking from '../components/booking';
import RoomDetail from './RoomDetail';



const ResPage = (props) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomsx, setRoomsx] = useState([{ id: null, name: null, addons: null, rates: null, guests: null, capacity: 0 }]);
    const [roomn, setRoomn] = useState(1);
    const [guestn, setGuestn] = useState(1);
    const [guestnx, setGuestnx] = useState(0);
    const [currentItem, setCurrentItem] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [nights, setNights] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedHotel, setSelectedHotel] = useState(null);


    const navigate = useNavigate();

    const location = useLocation();


    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/ROOM`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate: startDate, endDate: endDate, hotel: selectedHotel }),
            });
            const result = await response.json();
            setRooms(result);
            console.log(startDate);
            console.log(endDate);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {

        fetchData();
    }, [selectedHotel]);


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
            setRoomsx(roomsx.slice(0, - (roomsx.length - roomn)));
        } else if (roomsx.length < roomn) {
            let x = { id: null, name: null, addons: null, rates: null, guests: null };
            setRoomsx([...roomsx, ...Array(roomn - roomsx.length).fill(x)]);
            console.log(roomsx)
        }
    }, [roomn]); // Dependency array

    const GuestCalc = () => {
        const totalGuests = roomsx.reduce((sum, room) => sum + (room.guests || 0), 0);
        setGuestnx(totalGuests);
        console.log(`guests: ${totalGuests}`);
    };

    const handleBookNow = (roomId) => {
        navigate(`/room/${roomId}`); // Navigate to the Room Detail page with the room ID
    };


    const selectRoom = (selected) => {
        let x = roomsx;
        x[currentItem].id = selected.room_id;
        x[currentItem].type_name = selected.type_name;
        x[currentItem].rates = selected.rates;
        x[currentItem].capacity = selected.capacity;

        setRoomsx(x);
        console.log(roomsx);
        setCurrentItem(currentItem + 1);
    }

    const handleContinueToPayment = () => {

        let total = 0;
        for (let i = 0; i < roomsx.length; i++) {
            total += roomsx[i].rates;
        }
        //setTotal(x);


        navigate("/payment", {
            state: {
                roomsx,
                startDate,
                endDate,
                total
            }
        });
    }

    return (
        <div className="reservation-page">
            <Booking setroomn={setRoomn} setguestn={setGuestn} setNights={setNights} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} fetchData={fetchData} selectedHotel={selectedHotel} setSelectedHotel={setSelectedHotel} />
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
            }}>
                <p>Guests: {guestnx}/{guestn}&emsp;&emsp;&emsp;&emsp;Rooms:</p>
                <div style={{ marginLeft: "auto" }} className='ProceedToPayment'>
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: guestn === guestnx ? "#007BFF" : "#ccc", // Change color based on condition
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: guestn === guestnx ? "pointer" : "not-allowed", // Change cursor based on condition
                        }}
                        onClick={handleContinueToPayment}
                        disabled={guestn !== guestnx} // Disable button if the condition is not met
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
            <div className='shopping-cart' style={{ display: 'flex', flexWrap: 'wrap' }}>
                {roomsx.map((roomx, index) => (
                    <div key={index} className='cart-room' style={{ margin: '0.1em', padding: '1em', background: 'white', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)', borderRadius: '7px' }}>
                        <p>room: {roomx.type_name ? roomx.type_name : "Please Select a room"}</p>
                        <p>features: {roomx.addons}</p>
                        <p>price: {roomx.rates}</p>
                        <p>guests: <input
                            className='GUESTSNUMBER'
                            type="number"
                            max={roomx.capacity ? roomx.capacity : 0}
                            min={0}
                            onChange={(e) => {
                                const newRoomsx = [...roomsx];
                                newRoomsx[index].guests = Number(e.target.value);
                                setRoomsx(newRoomsx);
                                GuestCalc();
                                console.log(roomsx);
                            }}
                        /></p>
                    </div>
                ))}
            </div>
            <div>





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
                            <img src={room.image} alt={room.type_name} className="reservation-room-image" />
                            <div className="reservation-room-details">
                                <h2>{room.type_name}</h2>
                                <p>{room.description}</p>
                                <p className="reservation-price">{room.rates}</p>
                                <p>{room.hotel}</p>
                                <p>{room.address}</p>
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
        </div >
    );
};

export default ResPage;