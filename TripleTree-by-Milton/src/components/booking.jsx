import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Booking(props) {
    const nav = useNavigate();

    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(2);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(hotels[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/hotels`);
                const result = await response.json();
                setHotels(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const calculateNights = () => {
        if (props.startDate && props.endDate) {
            const start = new Date(props.startDate);
            const end = new Date(props.endDate);
            const difference = (end - start) / (1000 * 60 * 60 * 24); // Convert ms to days
            props.setNights(difference > 0 ? difference : 0);
            return difference > 0 ? difference : 0;
        }
        props.setNights(0);
        return 0;
    };

    const nights = calculateNights();

    return (
        <section className="booking-section">
            <h2 className="booking-title">Book your next ALL Inclusive Collection experience</h2>
            <div className="booking-widget">
                <div className="booking-details">
                    <div className="booking-item">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            onChange={(e) => props.setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="booking-item">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            onChange={(e) => props.setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="booking-item">
                        <label>Rooms & Guests</label>
                        <p
                            onClick={() => { setIsDropdownOpen(!isDropdownOpen); nav(''); }}
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
                                        onChange={(e) => { setRooms(Number(e.target.value)); props.setroomn(Number(e.target.value)); }}
                                    />
                                </div>
                                <div className="dropdown-item">
                                    <label>Guests:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={guests}
                                        onChange={(e) => { setGuests(Number(e.target.value)); props.setguestn(Number(e.target.value)); }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="booking-item">
                        <label htmlFor="dropdown">Choose a hotel:</label>
                        <select id="dropdown" value={props.selectedHotel} onChange={(e) => props.setSelectedHotel(e.target.value)}>
                            <option value="" disabled>
                                Select an option
                            </option>
                            {hotels.map((hotel, index) => (
                                <option key={index} value={hotel.hotel_id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>
                        {props.selectedHotel && <p>You selected: {props.selectedHotel}</p>}
                    </div>

                </div>
                <div className="booking-summary">
                    <p className="price">????</p>
                    <p className="stay-info">
                        {nights || 0} night{nights !== 1 ? "s" : ""} - {guests} guest
                        {guests !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link to="/Reservations"><button className="booking-button" onClick={props.fetchData}>Book Now</button></Link>
            </div>
        </section>
    );
}

export default Booking;