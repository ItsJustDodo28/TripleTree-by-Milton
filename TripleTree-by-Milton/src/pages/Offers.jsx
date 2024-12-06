import "../styles/Offers.css";

const offers = [
    {
        id: 1,
        title: "2X Points",
        description: "Earn double points for each night of your stay.",
        image: "https://via.placeholder.com/400x300",
        tags: ["Earn Points", "Honors Member"],
    },
    {
        id: 2,
        title: "Honors Discount Advance Purchase",
        description: "Save up to 17% off our Best Available Rate* by booking in advance. It pays to plan ahead!",
        image: "https://via.placeholder.com/400x300",
        tags: ["Discount"],
    },
    {
        id: 3,
        title: "Family Vacation Package",
        description: "Enjoy special deals for your family vacation with complimentary breakfast included.",
        image: "https://via.placeholder.com/400x300",
        tags: ["Family", "Breakfast Included"],
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
