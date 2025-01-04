import { useEffect, useRef  } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import Logo from '/Logo.png';
import Fter from '../components/Footer';
import Chatbot from '../components/Chatbot';

function Layout() {
  const location = useLocation();
  const divRef = useRef(null);


  useEffect(() => {
   const adjustContentPadding = () => {
      const nv = document.querySelector('.NavBar');
      const content = document.querySelector('.content');
      const ft = document.querySelector('.Footer');
      if (nv && content && !content.querySelector('.hero') && ft) {
        const navbarHeight = nv.offsetHeight;
        content.style.top = `${navbarHeight}px`;
        const contentHeight = content.offsetHeight + nv.offsetHeight;
        ft.style.top = `${contentHeight}px`;

        console.log(`ftr-top: ${content.offsetHeight} + ${nv.offsetHeight}`); // Debugging
      }
      else if (content && content.querySelector('.hero') && ft) {
        content.style.top = '0';
        const contentHeight = content.offsetHeight;
        ft.style.top = `${contentHeight}px`;
        console.log(`ftr-top: ${content.offsetHeight}`); // Debugging
      }
    };
    

    // Initial adjustment
    adjustContentPadding();


    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === "characterData") {
          console.log("Div content changed!");
          adjustContentPadding();
        }
      });
    });

    if (divRef.current) {
      observer.observe(divRef.current, {
        childList: true, // Observe direct children
        subtree: true, // Observe all descendants
        characterData: true, // Observe text content changes
      });
    }



    // Adjust on window resize
    window.addEventListener('resize', adjustContentPadding);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', adjustContentPadding);
      observer.disconnect();
    };
  }, [location]); // Depend on location to re-run effect on route change


  

  return (
    <div className='App'>
      <NavBar>
        <img src={Logo} height={120} className='logo' />
      </NavBar>
      <div ref={divRef} className='content'>
        <Outlet />
      </div>
      <Fter></Fter>
      <Chatbot />
    </div>
  );
}

export default Layout;
