/* eslint-disable react/prop-types */
import { useState } from 'react';
import NavButton from './navButton';

function NavBar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className='NavBar'>
        <div>
          {props.children}
        </div>
        <div className='nav-buttons'>
          <NavButton label="Home" to="/" />
          <NavButton label="About" to="/about" />
          <NavButton label="Reservations" to="/Reservations" />
        </div>
        <button className='menu-button' onClick={toggleSidebar}>
          ☰
        </button>
      </nav>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className='close-button' onClick={toggleSidebar}>
          &times;
        </button>
        <ul>
          <li><NavButton label="Home" to="/" onClick={toggleSidebar} /></li>
          <li><NavButton label="About" to="/about" onClick={toggleSidebar} /></li>
          <li><NavButton label="Reservations" to="/Reservation" onClick={toggleSidebar} /></li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;