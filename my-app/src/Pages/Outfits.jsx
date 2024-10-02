import React, { useState } from 'react';
import './CSS/Outfits.css';
import outfit1 from '../components/Assets/outfit1.webp';
import outfit2 from '../components/Assets/outfit2.webp';
import outfit3 from '../components/Assets/outfit3.webp';
import pastPick1 from '../components/Assets/pastPick1.webp'; // New past pick image
import pastPick2 from '../components/Assets/pastPick2.webp'; // New past pick image

const Outfits = () => {
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [texture, setTexture] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['Shirts', 'Pants', 'Jackets', 'Dresses'];
  const colors = ['Red', 'Blue', 'Green', 'Black'];
  const textures = ['Cotton', 'Wool', 'Silk', 'Denim'];

  const images = [outfit1, outfit2, outfit3];

  const pastPicks = [
    { image: pastPick1, description: 'Elegant Summer Dress' },
    { image: pastPick2, description: 'Casual Denim Jacket' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className="outfits-container">
        <div className="input-container">
          <label className="upload-label" htmlFor="upload">
            Select images+
          </label>
          <input id="upload" type="file" className="upload-button" />
          <h4>Select three images each for top,pant,jacket(optional) </h4>
        </div>

        <div className="input-container">
          <label htmlFor="category"></label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dropdown"
          >
            <option value="">--Select Category--</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="color"></label>
          <select
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="dropdown"
          >
            <option value="">--Select Color--</option>
            {colors.map((clr) => (
              <option key={clr} value={clr}>
                {clr}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="texture"></label>
          <select
            id="texture"
            value={texture}
            onChange={(e) => setTexture(e.target.value)}
            className="dropdown"
          >
            <option value="">--Select Texture--</option>
            {textures.map((tx) => (
              <option key={tx} value={tx}>
                {tx}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="slider-container">
        <button className="slider-button left" onClick={prevImage}>
          &#9664;
        </button>
        <img
          src={images[currentImageIndex]}
          alt={`Outfit ${currentImageIndex + 1}`}
          className="slider-image"
        />
        <button className="slider-button right" onClick={nextImage}>
          &#9654;
        </button>
      </div>

      <div className="past-picks">
        <h2>Styled by AI-Past Picks</h2>
        <div className="past-picks-container">
          {pastPicks.map((pick, index) => (
            <div key={index} className="past-pick-item">
              <img src={pick.image} alt={`Past Pick ${index + 1}`} className="past-pick-image" />
              <p className="past-pick-description">{pick.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Outfits;
