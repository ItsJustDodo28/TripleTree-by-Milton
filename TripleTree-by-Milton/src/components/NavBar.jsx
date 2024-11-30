import styles from "./NavBar.module.css"

function NavBar(props){


    return(
        <div className={styles.NavBar}>
            {props.children}
        </div>

    )
}

export default NavBar