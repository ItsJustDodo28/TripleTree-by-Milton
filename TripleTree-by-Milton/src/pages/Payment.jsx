import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Payment.css";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {};
    const [userInfo, setUserInfo] = useState({ fullName: "", email: "", phone: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("creditCard"); // Default to credit card
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Check if the user is logged in and fetch profile if so
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/check-auth", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUserInfo({
                        fullName: `${data.firstName} ${data.lastName}`,
                        email: data.email || "",
                        phone: data.phone || "",
                    });
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            }
        };
        checkAuth();
    }, []);

    // Save booking details to the database
    const saveBookingToDatabase = async () => {
        try {
            const response = await fetch("/api/booking/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    rooms: state.roomsx,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    totalPrice: state.total,
                    guestInfo: userInfo,
                    paymentMethod: paymentMethod,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Booking saved successfully:", data);
                alert("Booking confirmed successfully!");
                navigate("/confirmation", { state: { bookingId: data.bookingId } });
            } else {
                const errorData = await response.json();
                console.error("Error saving booking:", errorData);
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error saving booking to database:", error);
            alert("An error occurred while saving the booking.");
        }
    };

    // Handle form submission
    const handleBookingSubmission = async () => {
        if (!state.roomsx || !state.total) {
            alert("Invalid booking details.");
            return;
        }

        if (paymentMethod === "creditCard") {
            await saveBookingToDatabase();
        }
    };

    // PayPal payment flow
    const handlePayPalPayment = async () => {
        try {
            const response = await fetch("/api/paypal/create-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    total: state.total,
                    currency: "USD",
                    guestInfo: userInfo,
                    bookingDetails: {
                        rooms: state.roomsx,
                        startDate: state.startDate,
                        endDate: state.endDate,
                    },
                }),
            });
    
            const data = await response.json();
            if (data.approvalUrl) {
                window.location.href = data.approvalUrl; // Redirect to PayPal
            } else {
                console.error("PayPal Create Payment Error Response:", data);
                alert("Error initiating PayPal payment.");
            }
        } catch (error) {
            console.error("Error initiating PayPal payment:", error);
            alert("Error initiating PayPal payment.");
        }
    };
    

    return (
        <div className="payment-page">
            <h1>Complete Your Booking</h1>
            <div className="payment-container">
                {/* Guest Information and Payment Form */}
                <div className="payment-form">
                    <h2>Guest Information</h2>
                    {!isLoggedIn ? (
                        <form>
                            <label>
                                Full Name
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    required
                                    value={userInfo.fullName}
                                    onChange={(e) =>
                                        setUserInfo((prev) => ({ ...prev, fullName: e.target.value }))
                                    }
                                />
                            </label>
                            <label>
                                Email Address
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={userInfo.email}
                                    onChange={(e) =>
                                        setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                />
                            </label>
                            <label>
                                Phone Number
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    required
                                    value={userInfo.phone}
                                    onChange={(e) =>
                                        setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
                                    }
                                />
                            </label>
                        </form>
                    ) : (
                        <div>
                            <p>
                                <strong>Name:</strong> {userInfo.fullName}
                            </p>
                            <p>
                                <strong>Email:</strong> {userInfo.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {userInfo.phone}
                            </p>
                        </div>
                    )}

                    <h2>Payment Information</h2>
                    <div className="payment-methods">
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="creditCard"
                                checked={paymentMethod === "creditCard"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Credit Card
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                checked={paymentMethod === "paypal"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            PayPal
                        </label>
                    </div>

                    {paymentMethod === "creditCard" && (
                        <form>
                            <label>
                                Credit Card Number
                                <input type="text" placeholder="1234 5678 9012 3456" required />
                            </label>
                            <label>
                                Expiration Date
                                <input type="text" placeholder="MM/YY" required />
                            </label>
                            <label>
                                CVV
                                <input type="text" placeholder="123" required />
                            </label>
                            <button
                                type="button"
                                className="confirm-booking-button"
                                onClick={handleBookingSubmission}
                            >
                                Confirm Booking
                            </button>
                        </form>
                    )}

                    {paymentMethod === "paypal" && (
                        <button
                            type="button"
                            className="confirm-booking-button paypal-button"
                            onClick={handlePayPalPayment}
                        >
                            Pay with PayPal
                        </button>
                    )}
                </div>

                {/* Sticky Reservation Summary */}
                <div className="reservation-summary">
                    <h2>Reservation Summary</h2>
                    <ul>
                        {state.roomsx.map((room, index) => (
                            <div key={index}>
                                <li>
                                    <p>
                                        <strong>Room:</strong> {room.type_name}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <strong>Guests:</strong> {room.guests}
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <strong>Price:</strong> ${room.rates}
                                    </p>
                                </li>
                            </div>
                        ))}
                    </ul>
                    <p>
                        <strong>Total Price:</strong> ${state.total}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
