import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const content = document.querySelector('.content');
    if (navbar && content) {
      const navbarHeight = navbar.offsetHeight;
      content.style.paddingTop = `${navbarHeight}px`;
      console.log(navbarHeight)
    }
  }, []);


  return (
    <>
      <NavBar>
        <img src={viteLogo} />
      </NavBar>
      <div className='content'>
        <p>hello</p>
      </div>
    </>
  )
}

export default App
