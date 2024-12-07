import "../styles/Offers.css";
import Elite from "/TripleTreeEliteDiscout.jpg"
import Celebrate from "/Celebrate.jpg"
import WorkAndRelax from "/WorkAndRelax.jpg"
import StayLonger from "/StayLonger.jpg"
import Breakfast from "/Breakfast.jpg"
const offers = [
    {
        id: 1,
        title: "Stay Longer, Save More",
        description: "Extend your getaway and enjoy up to 20% off when you stay for 3 nights or more. The longer you stay, the more you save!",
        image: StayLonger,
        tags: ["Discount"],
    },
    {
        id: 2,
        title: "Complimentary Breakfast Package",
        description: "Start your mornings right with a complimentary breakfast for every night of your stay. Book now and indulge in a delicious start to your day.",
        image: Breakfast,
        tags: ["Breakfast Included"],
    },
    {
        id: 3,
        title: "Exclusive Members' Discount",
        description: "Join our rewards program and unlock an extra 10% off your bookings, plus exclusive benefits like free upgrades and late checkout.",
        image: Elite,
        tags: ["Discount", "Elite Member"],
    },
    {
        id: 4,
        title: "Celebrate Your Special Occasion",
        description: "Celebrate birthdays, anniversaries, or any special day with us! Book our celebration package and receive complimentary room decorations and a cake.",
        image: Celebrate,
        tags: ["Discount" , "Special Occasion"],
    },
    {
        id: 5,
        title: "Work & Relax Package",
        description: "Need a change of scenery? Book your workcation with high-speed Wi-Fi, a comfortable workspace, and complimentary coffee, all at a special discounted rate.",
        image: WorkAndRelax,
        tags: ["Discount"],
    },
];

const Offers = () => {
    return (
        <div className="offers-page">
            <header className="offers-header">
                <h1>Special Offers</h1>
                <p>Showing 1-{offers.length} of {offers.length} offers</p>
                <button className="filter-button">Filters</button>
            </header>

            <div className="offers-list">
                {offers.map((offer) => (
                    <div key={offer.id} className="offer-card">
                        <img src={offer.image} alt={offer.title} className="offer-image" />
                        <div className="offer-content">
                            <h2>{offer.title}</h2>
                            <p>{offer.description}</p>
                            <div className="offer-tags">
                                {offer.tags.map((tag, index) => (
                                    <span key={index} className="offer-tag">{tag}</span>
                                ))}
                            </div>
                            <button className="offer-button">View Offer Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Offers;
