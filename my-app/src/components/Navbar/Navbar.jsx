import React from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported correctly
import './Navbar.css'; 
import logo from '../Assets/logo.png'; 
import cart from '../Assets/cart.png';

const Navbar = () => {
  const [menu, setMenu] = React.useState("");
  const navigate = useNavigate();

  const handleNavigation = (path, menuItem) => {
    setMenu(menuItem);
    navigate(path);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ul className="nav-menu">
        <li onClick={() => handleNavigation("/", "Home")} className={menu === "Home" ? "active" : ""}>
          Home
        </li>
        <li onClick={() => handleNavigation("/outfits", "Outfits")} className={menu === "Outfits" ? "active" : ""}>
          Outfits
        </li>
        <li onClick={() => handleNavigation("/wardrobe", "Wardrobe")} className={menu === "Wardrobe" ? "active" : ""}>
          Wardrobe
        </li>
      </ul>
      <div className="nav-cart">
        <div className="cart-icon-container" onClick={handleCartClick}>
          <img src={cart} alt="Cart" className="cart-icon" />
          <div className="nav-cart-count">0</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
