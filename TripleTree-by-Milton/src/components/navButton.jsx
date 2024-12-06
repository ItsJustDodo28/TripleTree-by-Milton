/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./NavButton.css";

const NavButton = ({ label, onClick, to }) => {
    return (
        <Link to={to}>
            <button onClick={onClick} className="nav-button">
                {label}
            </button>
        </Link>
    );
};

export default NavButton;