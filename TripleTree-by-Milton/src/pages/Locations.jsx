import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/Locations.css";
import { useState, useEffect } from "react";

const Locations = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null); // Initially null

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/hotels`);
                const result = await response.json();
                setHotels(result);
                if (result.length > 0) {
                    setSelectedHotel(result[0]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const mapContainerStyle = {
        width: "100%",
        height: "100%",
    };

    return (
        <div className="locations-page">
            {/* Left Sidebar for Hotels */}
            <div className="hotel-list">
                <h2>Our Locations</h2>
                <div className="hotel-grid">
                    {hotels.map((hotel) => (
                        <div
                            key={hotel.hotel_id}
                            className={`hotel-card ${selectedHotel && hotel.hotel_id === selectedHotel.hotel_id ? "active" : ""
                                }`}
                            onClick={() => setSelectedHotel(hotel)}
                        >
                            <img src={hotel.image} alt={hotel.name} className="hotel-image" />
                            <div className="hotel-info">
                                <h3>{hotel.name}</h3>
                                <p>{hotel.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Container */}
            <div className="map-container">
                <LoadScript googleMapsApiKey="AIzaSyBLNV_yj1q6X21zNopvPJV31MrHwwGRsj4">
                    {selectedHotel && (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={{ lat: selectedHotel.lat, lng: selectedHotel.lng }}
                            zoom={12}
                        >
                            <Marker position={{ lat: selectedHotel.lat, lng: selectedHotel.lng }} />
                        </GoogleMap>
                    )}
                </LoadScript>
            </div>
        </div>
    );
};

export default Locations;
