import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import Logo from '/Logo.png';


function Layout() {
  const location = useLocation();

  useEffect(() => {
    const adjustContentPadding = () => {
      const nv = document.querySelector('.NavBar');
      const content = document.querySelector('.content');
      if (nv && content && !content.querySelector('.hero')) {
        const navbarHeight = nv.offsetHeight;
        content.style.top = `${navbarHeight}px`;
        console.log(`Content padding-top: ${content.style.top}px`); // Debugging
        console.log(`Navbar height: ${navbarHeight}px`); // Debugging
      }
      else if (content && content.querySelector('.hero')) {
        content.style.top = '0';
      }
    };

    // Initial adjustment
    adjustContentPadding();

    // Adjust on window resize
    window.addEventListener('resize', adjustContentPadding);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', adjustContentPadding);
    };
  }, [location]); // Depend on location to re-run effect on route change

  return (
    <>
      <NavBar>
        <img src={Logo} height={120} className='logo' />
      </NavBar>
      <div className='content'>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
