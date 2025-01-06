import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Payment.css";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {};
    const [userInfo, setUserInfo] = useState({ fullName: "", email: "", phone: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("paypal");

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

    const handlePayPalPayment = async () => {
        // Load the PayPal script dynamically
        const paypalScript = document.createElement("script");
        paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AQW0yQnJBG050nvrf-bLQ-4pWFkj9sI4Axk7wJsqUu1K4I21mg5WBeI74nULj4twkZrwX0w1Q1CJyGJc&currency=USD";
        paypalScript.onload = () => {
            window.paypal.Buttons({
                createOrder: async (data, actions) => {
                    try {
                        const response = await fetch("/api/paypal/create-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
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
                        const result = await response.json();
                        if (result.id) {
                            return result.id;
                        } else {
                            throw new Error("Failed to create PayPal order");
                        }
                    } catch (error) {
                        console.error("Error creating PayPal order:", error);
                    }
                },
                onApprove: async (data, actions) => {
                    try {
                        const response = await fetch(`/api/paypal/execute-payment?token=${data.orderID}`, {
                            method: "GET",
                            credentials: "include",
                        });
                        if (response.ok) {
                            alert("Payment successful!");
                            navigate("/confirmation");
                        } else {
                            console.error("Error executing payment:", await response.json());
                        }
                    } catch (error) {
                        console.error("Error executing PayPal payment:", error);
                    }
                },
                onError: (error) => {
                    console.error("PayPal button error:", error);
                },
            }).render("#paypal-button-container");
        };
        document.body.appendChild(paypalScript);
    };

    useEffect(() => {
        if (paymentMethod === "paypal") {
            handlePayPalPayment();
        }
    }, [paymentMethod]);

    return (
        <div className="payment-page">
            <h1>Complete Your Booking</h1>
            <div className="payment-container">
                <div className="payment-form">
                    <h2>Guest Information</h2>
                    {!isLoggedIn ? (
                        <form>
                            <label>
                                Full Name
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={userInfo.fullName}
                                    onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                                />
                            </label>
                            <label>
                                Email Address
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                />
                            </label>
                            <label>
                                Phone Number
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={userInfo.phone}
                                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
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
                        <div id="paypal-button-container"></div>
                    </div>
                </div>
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
