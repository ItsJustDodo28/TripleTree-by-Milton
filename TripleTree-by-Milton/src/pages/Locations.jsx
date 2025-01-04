import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/Locations.css";
import { useState } from "react";






const Locations = () => {
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


    const mapContainerStyle = {
        width: "100%",
        height: "100%",
    };

    const center = {
        lat: selectedHotel.lat,
        lng: selectedHotel.lng,
    };

    return (
        <div className="locations-page">
            {/* Left Sidebar for Hotels */}
            <div className="hotel-list">
                <h2>Our Locations</h2>
                <div className="hotel-grid">
                    {hotels.map((hotel) => (
                        <div
                            key={hotel.id}
                            className={`hotel-card ${hotel.id === selectedHotel.id ? "active" : ""
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

            <div className="map-container">
                <LoadScript googleMapsApiKey="AIzaSyBLNV_yj1q6X21zNopvPJV31MrHwwGRsj4">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                    >
                        <Marker position={{ lat: selectedHotel.lat, lng: selectedHotel.lng }} />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default Locations;
