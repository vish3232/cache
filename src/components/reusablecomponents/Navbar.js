import React from 'react'
import Logo from '../../assets/Logo.svg'
import '../reusablecomponentscss/Navbar.css'

const Navbar = () => {
    return (
        <nav>
            <img src={Logo} alt="" />
            <div><span>Creatosaurus</span> | Cache</div>
        </nav>
    )
}

export default Navbar
