import styles from "./NavBar.module.css"

function NavBar({ children }){


    return(
        <div className={styles.NavBar}>
            {children}
        </div>

    )
}

export default NavBar