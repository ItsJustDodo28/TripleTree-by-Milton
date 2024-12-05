import { useEffect } from 'react'
//import reactLogo from './assets/react.svg'
import Logo from '/Logo.png'
import './App.css'
import NavBar from './components/NavBar'

function App() {
  
  useEffect(() => {
    const adjustContentPadding = () => {
      const nv = document.querySelector('.NavBar');
      const content = document.querySelector('.content');
      if (nv && content) {
        const navbarHeight = nv.offsetHeight;
        content.style.top = `${navbarHeight}px`;
        console.log(`Content padding-top: ${content.style.top}px`); // Debugging
        console.log(`Navbar height: ${navbarHeight}px`); // Debugging
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
  }, []);


  return (
    <>
        <NavBar>
          <img src={Logo} height={120}/>
        </NavBar>
      <div className='content'>
        <p>hello</p>
        <br/>
        <img src='https://www.hilton.com/im/en/NoHotel/2201396/all-ecomm-image-family-playing-beach.jpeg?impolicy=crop&cw=5000&ch=1388&gravity=NorthWest&xposition=0&yposition=927&rw=3840&rh=1068' width={visualViewport.width}/>
      </div>
    </>
  )
}

export default App;
