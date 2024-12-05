import { useState } from 'react';
import { Link } from "react-router-dom";

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
          <Link to="/"><button>Home</button></Link>
          <Link to="/test"><button>About</button></Link>
          <button>Services</button>
          <button>Contact</button>
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
          <li><Link to="/"><button onClick={toggleSidebar}>Home</button></Link></li>
          <li><Link to="/test"><button onClick={toggleSidebar}>About</button></Link></li>
          <li><button onClick={toggleSidebar}>Services</button></li>
          <li><button onClick={toggleSidebar}>Contact</button></li>
        </ul>
      </div>
    </>
  );
}

export default NavBar;