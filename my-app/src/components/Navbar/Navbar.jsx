import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className='navbar'>
      {/* Logo or Brand Name */}
      <div className='navbar-logo'>
      </div>
      
      {/* Menu Items */}
      <ul className='navbar-menu'>
        <li className='navbar-item'><a href='#home'>Home</a></li>
        <li className='navbar-item'><a href='#about'>About</a></li>
        <li className='navbar-item'><a href='#shop'>Shop</a></li>
        <li className='navbar-item'><a href='#contact'>Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;