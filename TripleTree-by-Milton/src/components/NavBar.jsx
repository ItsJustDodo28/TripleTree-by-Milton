/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import NavButton from './NavButton';
import Login from './Login';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function NavBar(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null); // For greeting the user
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };
    const location = useLocation();
    // Fetch user info on component mount
    useEffect(() => {
      const fetchUser = async () => {
          try {
              const response = await fetch('http://localhost:5000/api/check-auth', {
                  credentials: 'include',
              });
              
              console.log('API response status:', response.status);
  
              if (response.ok) {
                  const data = await response.json();
                  console.log('User data:', data);
                  setUser({name: data.firstName, role: data.role});
              } else {
                  console.log('User not logged in');
                  setUser(null);
              }
          } catch (err) {
              console.error('Error fetching user info:', err);
              setUser(null);
          }
      };
  
      fetchUser();
  }, [location]);

  const HandlePage = () => {
    if(user.role === 'admin') 
      navigate('/AdminDashboard');
    else if(user.role === 'user')
      navigate('/ProfilePage');
    else
      navigate('/login'); 
      
};

  console.log('User state:', user);

    return (
        <>
            <nav className='NavBar'>
                <div className='logo-container'>{props.children}</div>
                <div className='nav-buttons'>
                    <NavButton label="Home" to="/" />
                    <NavButton label="About" to="/about" />
                    <NavButton label="Reservations" to="/Reservations" />
                    <NavButton label="Locations" to="/Locations" />
                    <NavButton label="Offers" to="/offers" />
                    <NavButton label="Help" to="/CustomerSupport" />
                </div>
                <button className='menu-button' onClick={toggleSidebar}>
                    ☰
                </button>
                {user ? (
                  <>
                    <span className='greeting'>Hello, {user.name}</span> 
                       
                     <button className='sign-button' onClick={HandlePage}>
                     <img src="/user.png" height={35} alt="Login" />
                     </button>
                      </>
                 
                ) : (
                    <button className='sign-button' onClick={handleLogin}>
                        <img src="/login.png" height={35} alt="Login" />
                    </button>
                )}
            </nav>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className='close-button' onClick={toggleSidebar}>
                    &times;
                </button>
                <ul>
                    {!user && (
                        <button className='sign-button.side' onClick={handleLogin}>
                            Login
                        </button>
                    )}
                    <li><NavButton label="Home" to="/" onClick={toggleSidebar} /></li>
                    <li><NavButton label="About" to="/about" onClick={toggleSidebar} /></li>
                    <li><NavButton label="Reservations" to="/Reservations" onClick={toggleSidebar} /></li>
                    <li><NavButton label="Locations" to="/Locations" onClick={toggleSidebar} /></li>
                    <li><NavButton label="Offers" to="/offers" onClick={toggleSidebar} /></li>
                    <li><NavButton label="Help" to="/CustomerSupport" onClick={toggleSidebar} /></li>
                </ul>
            </div>
            {isModalOpen && <Login onClose={closeModal} />}
        </>
    );
}

export default NavBar;
