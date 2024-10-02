import React, { useState } from 'react'; // Import useState
import './CSS/Wardrobe.css';
import outfit1 from '../components/Assets/outfit1.webp'
import outfit2 from '../components/Assets/outfit2.webp'
import outfit3 from '../components/Assets/outfit3.webp'
import outfit4 from '../components/Assets/pastPick1.webp'
import outfit5 from '../components/Assets/pastPick2.webp'

const Wardrobe = () => {
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [texture, setTexture] = useState('');

  const categories = ['Shirts', 'Pants', 'Jackets', 'Dresses'];
  const colors = ['Red', 'Blue', 'Green', 'Black'];
  const textures = ['Cotton', 'Wool', 'Silk', 'Denim'];

  // Sample items with title and image path
  const items = [
    { title: 'cotton black shirt and shorts', image: outfit1 },
    { title: 'cotton Brown top, black pants', image: outfit2 },
    { title: 'Nylon Grey top, brown pants', image: outfit3 },
    { title: 'black top and pant', image: outfit4},
    { title: 'cotton Brown top, brown pants', image: outfit5 },
    { title: 'cotton black shirt and shorts', image: outfit1 },
    { title: 'cotton Brown top, black pants', image: outfit2 },
    { title: 'black top and pant', image: outfit4 },
    { title: 'Grey top, brown pants', image: outfit3 },
  ];

  return (
    <div className='wardrobe-container'>
      <div className="container">
      <div className="upload-container">
        <label className="upload-label" htmlFor="upload">
          +Upload
        </label>
        <input id="upload" type="file" className="upload-button" multiple />
      </div>

      <div className="upload-container">
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

      <div className="upload-container">
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

      <div className="upload-container">
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

      {/* New container for wardrobe items */}
      
    </div>
    <div className="wardrobe">
        <h3>Your Wardrobe Items</h3>
        <div className="image-grid">
          {items.map((item, index) => (
            <div className="image-box" key={index}>
              <h4>{item.title}</h4>
              <div className="image-hover">
                <img src={item.image} alt={item.title} className="item-image" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
