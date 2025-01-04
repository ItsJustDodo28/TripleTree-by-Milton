import "../styles/Payment.css";
import { useLocation } from "react-router-dom";


const Payment = () => {
    const location = useLocation();
    const state = location.state || {};

    return (
        <div className="payment-page">
            <h1>Complete Your Booking</h1>
            <div className="payment-container">
                {/* Guest Information and Payment Form */}
                <div className="payment-form">
                    <h2>Guest Information</h2>
                    <form>
                        <label>
                            Full Name
                            <input type="text" placeholder="Enter your full name" required />
                        </label>
                        <label>
                            Email Address
                            <input type="email" placeholder="Enter your email" required />
                        </label>
                        <label>
                            Phone Number
                            <input type="tel" placeholder="Enter your phone number" required />
                        </label>
                        <h2>Payment Information</h2>
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
                        <button type="submit" className="confirm-booking-button">
                            Confirm Booking
                        </button>
                    </form>
                </div>

                {/* Sticky Reservation Summary */}
                <div className="reservation-summary">
                    <h2>Reservation Summary</h2>
                    <ul>
                        {state.roomsx.map((room, index) => (
                            <div key={index}>
                                <li>
                                    <p><strong>Room:</strong> {room.type_name}</p>
                                </li>
                                <li>
                                    {/* <ul>
                                        {
                                            room.addons.map((addon, index) => (
                                                <li key={index}>
                                                    <p><strong>Addons:</strong> {addon}</p>
                                                </li>
                                            ))
                                        }
                                    </ul> */}
                                </li>
                                <li>
                                    <p><strong>Guests:</strong> {room.guests}</p>
                                </li>
                                <li>
                                    <p><strong>Price:</strong> {room.rates}</p>
                                </li>
                            </div>
                        ))}
                    </ul>
                    <p><strong>Total Price:</strong> ${state.total}</p>
                </div>
            </div>
        </div>
    );
};


export default Payment;
