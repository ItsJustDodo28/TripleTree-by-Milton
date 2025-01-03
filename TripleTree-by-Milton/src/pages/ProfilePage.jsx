import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null); // State for selected booking
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // State for booking modal
    const [editProfileData, setEditProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/profile", {
                    credentials: "include", // Include cookies
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setUser(data.user);
                setBookingHistory(data.bookings);
                setEditProfileData({
                    firstName: data.user.first_name,
                    lastName: data.user.last_name,
                    emails: data.user.emails,
                    phones: data.user.phones,
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Error fetching profile data. Please try again.");
            }
        };

        fetchProfile();
    }, []);

    const toggleSettingsModal = () => {
        setIsSettingsModalOpen(!isSettingsModalOpen);
    };

    const toggleBookingModal = () => {
        setIsBookingModalOpen(!isBookingModalOpen);
    };

    const handleViewDetails = async (booking) => {
        try {
            console.log(`Fetching details for booking ID: ${booking.booking_id}`);
            const response = await fetch(`http://localhost:5000/api/booking-details/${booking.booking_id}`, {
                credentials: "include",
            });
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error("Failed to fetch booking details");
            }

            const bookingDetails = await response.json();
            console.log("Fetched booking details:", bookingDetails);
            setSelectedBooking(bookingDetails);
            toggleBookingModal();
        } catch (err) {
            console.error(err);
            alert("Error fetching booking details. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfileData({ ...editProfileData, [name]: value });
    };

    const handleProfileUpdate = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editProfileData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            alert("Profile updated successfully!");
            setUser((prevUser) => ({
                ...prevUser,
                first_name: editProfileData.firstName,
                last_name: editProfileData.lastName,
                emails: editProfileData.emails,
                phones: editProfileData.phones,
            }));
            toggleSettingsModal();
        } catch (err) {
            console.error(err);
            alert("Error updating profile. Please try again.");
        }
    };

    const handleAccountDeletion = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                const response = await fetch("http://localhost:5000/api/profile", {
                    method: "DELETE",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete account");
                }

                alert("Account deleted successfully!");
                navigate("/login"); // Redirect to login page
            } catch (err) {
                console.error(err);
                alert("Error deleting account. Please try again.");
            }
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/cancel-booking/${bookingId}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to cancel booking");
                }

                alert("Booking canceled successfully!");
                setBookingHistory((prevHistory) =>
                    prevHistory.filter((booking) => booking.booking_id !== bookingId)
                );
                toggleBookingModal();
            } catch (err) {
                console.error(err);
                alert("Error canceling booking. Please try again.");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile-page">
            {/* User Profile Section */}
            <div className="profile-card">
                <h1>{`${user.first_name} ${user.last_name}`}</h1>
                <p>Email: {user.emails}</p>
                <p>Phone: {user.phones}</p>
                <div className="loyalty-section">
                    <p>
                        Loyalty Points: <strong>{user.loyalty_points}</strong>
                    </p>
                    <p>
                        Membership Level: <strong>{user.membership_level}</strong>
                    </p>
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
                            <div key={booking.booking_id} className="booking-card">
                                <h3>{booking.roomType}</h3>
                                <p>
                                    Check-In:{" "}
                                    <strong>{new Date(booking.checkIn).toLocaleDateString()}</strong>
                                </p>
                                <p>
                                    Check-Out:{" "}
                                    <strong>{new Date(booking.checkOut).toLocaleDateString()}</strong>
                                </p>
                                <p>
                                    Total Cost:{" "}
                                    <strong>{parseFloat(booking.totalCost).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}</strong>
                                </p>
                                <button
                                    className="view-details-button"
                                    onClick={() => handleViewDetails(booking)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no booking history yet.</p>
                )}
            </div>

            {/* Booking Details Modal */}
            {isBookingModalOpen && selectedBooking && (
                <div className="settings-modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={toggleBookingModal}>
                            &times;
                        </button>
                        <h2>Booking Details</h2>
                        <p>
                            <strong>Hotel Name:</strong> {selectedBooking.hotelName || "N/A"}
                        </p>
                        <p>
                            <strong>Room Type:</strong> {selectedBooking.roomType || "N/A"}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedBooking.roomDescription || "N/A"}
                        </p>
                        <p>
                            <strong>Check-In:</strong>{" "}
                            {new Date(selectedBooking.checkIn).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Check-Out:</strong>{" "}
                            {new Date(selectedBooking.checkOut).toLocaleDateString()}
                        </p>
                        <p>Status: <strong>{selectedBooking.status}</strong></p>
                        <p>
                            <strong>Total Cost:</strong>{" "}
                            {parseFloat(selectedBooking.totalCost).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </p>
                        {selectedBooking.services && selectedBooking.services.length > 0 && (
                            <>
                                <h3>Services Used:</h3>
                                <ul>
                                    {selectedBooking.services.map((service) => (
                                        <li key={service.service_id}>
                                            {service.name} -{" "}
                                            {parseFloat(service.price).toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {selectedBooking.paymentStatus && (
                            <p>
                                <strong>Payment Status:</strong> {selectedBooking.paymentStatus}
                            </p>
                        )}
                        {new Date(selectedBooking.checkIn) > new Date() && selectedBooking.status !== 'Canceled' && (
                            <button
                                className="cancel-booking-button"
                                onClick={() => handleCancelBooking(selectedBooking.booking_id)}
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {isSettingsModalOpen && (
                <div className="settings-modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={toggleSettingsModal}>
                            &times;
                        </button>
                        <h2>Account Settings</h2>

                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={editProfileData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={editProfileData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Emails</label>
                            <input
                                type="text"
                                name="emails"
                                value={editProfileData.emails}
                                onChange={handleInputChange}
                                placeholder="Enter your emails (comma-separated)"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Numbers</label>
                            <input
                                type="text"
                                name="phones"
                                value={editProfileData.phones}
                                onChange={handleInputChange}
                                placeholder="Enter your phone numbers (comma-separated)"
                            />
                        </div>

                        <button className="settings-button" onClick={handleProfileUpdate}>
                            Save Changes
                        </button>
                        <button
                            className="settings-button delete-account-button"
                            onClick={handleAccountDeletion}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
