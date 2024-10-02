import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; 
import './Navbar.css';
import logo from '../Assets/logo.png';

const Navbar = () => {
  const [menu, setMenu] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleNavigation = (path, menuItem) => {
    setMenu(menuItem);
    navigate(path);
  };


  const handleLoginSignupClick = () => {
    if (isAuthenticated) {
      signOut(auth)
        .then(() => {
          setIsAuthenticated(false); 
          alert('Successfully logged out.');
        })
        .catch((error) => {
          console.error('Error logging out:', error);
        });
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => handleNavigation("/", "Home")}>
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
      <button className="login-signup-btn" onClick={handleLoginSignupClick}>
        {isAuthenticated ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
};

export default Navbar;
