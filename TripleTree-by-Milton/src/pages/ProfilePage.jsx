import "../styles/ProfilePage.css";
import { useState } from "react";
import ProfilePic from "/Mahmoud.jpeg"
const ProfilePage = () => {
    const [user, setUser] = useState({
        name: "Mahmoud Ibrahim",
        email: "dodoismahmoud@gmail.com",
        phone: "+201121077522",
        loyaltyPoints: 1200,
        membershipLevel: "Gold Member",
        profilePicture: ProfilePic,
    });

    const bookingHistory = [
        {
            id: 1,
            hotelName: "TripleTree: Luxury Retreat",
            checkIn: "2023-12-15",
            checkOut: "2023-12-20",
            totalCost: "$500",
        },
        {
            id: 2,
            hotelName: "TripleTree: Cozy Escape",
            checkIn: "2024-10-10",
            checkOut: "2024-10-12",
            totalCost: "$300",
        },
    ];

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [editProfileData, setEditProfileData] = useState({ ...user });

    const toggleSettingsModal = () => {
        setIsSettingsModalOpen(!isSettingsModalOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfileData({ ...editProfileData, [name]: value });
    };

    const handleProfileUpdate = () => {
        setUser(editProfileData);
        toggleSettingsModal();
        alert("Profile updated successfully!");
    };

    return (
        <div className="profile-page">
            {/* User Profile Section */}
            <div className="profile-card">
                <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="profile-picture"
                />
                <h1>{user.name}</h1>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <div className="loyalty-section">
                    <p>Loyalty Points: <strong>{user.loyaltyPoints}</strong></p>
                    <p>Membership Level: <strong>{user.membershipLevel}</strong></p>
                </div>
                <button className="settings-button" onClick={toggleSettingsModal}>
                    Account Settings
                </button>
            </div>

            {/* Booking History Section */}
            <div className="booking-history">
                <h2>Your Booking History</h2>
                {bookingHistory.length > 0 ? (
                    <div className="booking-list">
                        {bookingHistory.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                <h3>{booking.hotelName}</h3>
                                <p>
                                    Check-In: <strong>{booking.checkIn}</strong>
                                </p>
                                <p>
                                    Check-Out: <strong>{booking.checkOut}</strong>
                                </p>
                                <p>
                                    Total Cost: <strong>{booking.totalCost}</strong>
                                </p>
                                <button className="view-details-button">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no booking history yet.</p>
                )}
            </div>

            {/* Settings Modal */}
            {isSettingsModalOpen && (
                <div className="settings-modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={toggleSettingsModal}>
                            &times;
                        </button>
                        <h2>Account Settings</h2>

                        <div className="form-group">
                            <label>Profile Picture</label>
                            <input
                                type="text"
                                name="profilePicture"
                                value={editProfileData.profilePicture}
                                onChange={handleInputChange}
                                placeholder="Enter image URL"
                            />
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={editProfileData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editProfileData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={editProfileData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <button className="settings-button" onClick={handleProfileUpdate}>
                            Save Changes
                        </button>
                        <button className="settings-button delete-account-button">
                            Delete Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
