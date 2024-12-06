import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/Locations.css";
import { useState } from "react";

const hotels = [
    {
        id: 1,
        name: "TripleTree: Luxury Retreat",
        description: "A luxurious stay in the heart of the city.",
        lat: 31.2001,
        lng: 29.9187,
        image: "/Luxury Retreat.jpg",
    },
    {
        id: 2,
        name: "TripleTree: Cozy Escape",
        description: "Comfortable and affordable lodging.",
        lat: 28.5091,
        lng: 34.5136,
        image: "/Cosy.jpg",
    },
    {
        id: 3,
        name: "TripleTree: Beachside Resort",
        description: "Relax and unwind by the ocean.",
        lat: 27.2579,
        lng: 33.8116,
        image: "/Beach-Side.jpg",
    },
    {
        id: 4,
        name: "TripleTree: Mountain Retreat",
        description: "Escape to nature in luxury.",
        lat: 29.2032,
        lng: 25.5195,
        image: "/Mountain.jpg",
    },
];

const Locations = () => {
    const [selectedHotel, setSelectedHotel] = useState(hotels[0]);

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
                            className={`hotel-card ${
                                hotel.id === selectedHotel.id ? "active" : ""
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

            {/* Right Side: Google Maps */}
            <div className="map-container">
                <LoadScript googleMapsApiKey="YOUR_API_KEY">
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
