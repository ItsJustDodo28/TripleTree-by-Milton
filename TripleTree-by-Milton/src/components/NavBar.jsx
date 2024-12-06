/* eslint-disable react/prop-types */
import { useState } from 'react';
import NavButton from './NavButton';
import Login from './Login'

function NavBar(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handelLogin = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className='NavBar'>
        <div className='logo-container'>
          {props.children}
        </div>
        <div className='nav-buttons'>
          <NavButton label="Home" to="/" />
          <NavButton label="About" to="/about" />
          <NavButton label="Reservations" to="/Reservations" />
          <NavButton label="Locations" to="/Locations" />
          <NavButton label="Offers" to="/offers" />
        </div>
        <button className='menu-button' onClick={toggleSidebar}>
          ☰
        </button>
        <button className='sign-button' onClick={handelLogin}><img src="/login.png" height={35}/></button>
      </nav>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className='close-button' onClick={toggleSidebar}>
          &times;
        </button>
        <ul>
          <button className='sign-button.side' onClick={handelLogin}>Login</button>
          <li><NavButton label="Home" to="/" onClick={toggleSidebar} /></li>
          <li><NavButton label="About" to="/about" onClick={toggleSidebar} /></li>
          <li><NavButton label="Reservations" to="/Reservation" onClick={toggleSidebar} /></li>
          <li><NavButton label="Locations" to="/Locations" onClick={toggleSidebar} /></li>
          <li><NavButton label="Offers" to="/offers" onClick={toggleSidebar} /></li>
        </ul>
      </div>
      {isModalOpen && <Login onClose={closeModal}/>}
    </>
  );
}

export default NavBar;