import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/Locations.css";
import { useState } from "react";

const hotels = [
    {
        id: 1,
        name: "TripleTree: Luxury Retreat",
        description: "Nestled in the heart of Alexandria, this branch combines modern luxury with the charm of the Mediterranean. Perfect for both business and leisure, it offers elegant rooms, fine dining, and exceptional city views.",
        lat: 31.2001,
        lng: 29.9187,
        image: "/Luxury Retreat.jpg",
    },
    {
        id: 2,
        name: "TripleTree: Cozy Escape",
        description:"Located in the serene town of Dahab, this branch provides a peaceful and affordable getaway. Surrounded by natural beauty, it's ideal for guests looking for a relaxing retreat close to the Red Sea.",
        lat: 28.5091,
        lng: 34.5136,
        image: "/Cosy.jpg",
    },
    {
        id: 3,
        name: "TripleTree: Beachside Resort",
        description: "Situated along the pristine shores of Hurghada, this resort offers stunning beach views, exciting water activities, and a tranquil atmosphere for the ultimate seaside vacation.",
        lat: 27.2579,
        lng: 33.8116,
        image: "/Beach-Side.jpg",
    },
    {
        id: 4,
        name: "TripleTree: Mountain Retreat",
        description: "Escape to the breathtaking Siwa Oasis, where this branch combines natural beauty with luxury. Ideal for adventurers and peace seekers, it offers a unique mix of relaxation and exploration in the desert landscape.",
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
