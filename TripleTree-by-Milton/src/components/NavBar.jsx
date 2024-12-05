
function NavBar(props){

    return(
        <nav className='NavBar'>
            <div>
                {props.children} 
            </div>
        </nav>

    )
}

export default NavBar