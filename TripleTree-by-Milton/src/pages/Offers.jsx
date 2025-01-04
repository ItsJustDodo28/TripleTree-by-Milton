import { useState, useEffect } from 'react';
import "../styles/Offers.css";

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [filterTag, setFilterTag] = useState('');
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOffers();
    }, [filterTag]);

    const fetchOffers = async () => {
        try {
            const response = await fetch(
                `/api/offers${filterTag ? `?tag=${filterTag}` : ''}`
            );
            const data = await response.json();
            setOffers(data);
        } catch (err) {
            console.error('Error fetching offers:', err);
        }
    };

    const fetchOfferDetails = async (offerId) => {
        try {
            const response = await fetch(`/api/offers/${offerId}`);
            const data = await response.json();
            setSelectedOffer(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching offer details:', err);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOffer(null);
    };

    const handleFilter = (tag) => {
        setFilterTag(tag);
    };

    return (
        <div className="offers-page">
            <header className="offers-header">
                <h1>Special Offers</h1>
                <p>Showing {offers.length} offers</p>
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${filterTag === 'Discount' ? 'active' : ''}`}
                        onClick={() => handleFilter('Discount')}
                    >
                        Discount Offers
                    </button>
                    <button
                        className={`filter-button ${filterTag === 'Breakfast Included' ? 'active' : ''}`}
                        onClick={() => handleFilter('Breakfast Included')}
                    >
                        Breakfast Included
                    </button>
                    <button
                        className={`filter-button ${filterTag === 'Elite Member' ? 'active' : ''}`}
                        onClick={() => handleFilter('Elite Member')}
                    >
                        Elite Member
                    </button>
                    <button
                        className={`filter-button ${filterTag === 'Special Occasion' ? 'active' : ''}`}
                        onClick={() => handleFilter('Special Occasion')}
                    >
                        Special Occasion
                    </button>
                    <button
                        className="filter-button"
                        onClick={() => handleFilter('')}
                    >
                        Clear Filters
                    </button>
                </div>
            </header>

            <div className="offers-list">
                {offers.map((offer) => (
                    <div key={offer.offer_id} className="offer-card">
                        <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="offer-image"
                        />
                        <div className="offer-content">
                            <h2>{offer.title}</h2>
                            <p>{offer.description}</p>
                            <div className="offer-tags">
                                {offer.tags.split(',').map((tag, index) => (
                                    <span key={index} className="offer-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <button
                                className="offer-button"
                                onClick={() => fetchOfferDetails(offer.offer_id)}
                            >
                                View Offer Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedOffer && (
                <div className="offer-modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeModal}>
                            &times;
                        </button>
                        <h2>{selectedOffer.title}</h2>
                        <img
                            src={selectedOffer.image_url}
                            alt={selectedOffer.title}
                            className="modal-image"
                        />
                        <p>{selectedOffer.description}</p>
                        <div className="offer-tags">
                            {selectedOffer.tags.split(',').map((tag, index) => (
                                <span key={index} className="offer-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
