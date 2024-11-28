import React, { useState } from 'react';
import './CSS/Outfits.css';

const Outfits = ({ images, onGenerateAIResult }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // "top" or "bottom"
  const [selectedTopImages, setSelectedTopImages] = useState([]);
  const [selectedBottomImages, setSelectedBottomImages] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  // Opens the image selection dialog for the chosen category (top or bottom)
  const openDialog = (category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  // Handles image selection, allowing only 3 per category
  const handleImageSelect = (imageUrl) => {
    const selectedImages = selectedCategory === 'top' ? selectedTopImages : selectedBottomImages;
    const setSelectedImages = selectedCategory === 'top' ? setSelectedTopImages : setSelectedBottomImages;

    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(selectedImages.filter((img) => img !== imageUrl)); // Deselect image if already selected
    } else  {
      setSelectedImages([...selectedImages, imageUrl]); 
    }
  };

  // Trigger AI model with selected images and display result
  const handleGenerate = async () => {
    if (selectedTopImages.length > 0 && selectedBottomImages.length >0) {
      setLoading(true); // Start loading
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        top: selectedTopImages,
        bottom: selectedBottomImages,
      }),
    });

    const data = await response.json();
    const resultImages = data.result_images;

    setAiResult(resultImages); // Store the paths of the result images to display
    setLoading(false); // Stop loading
    } else {
      alert('Please select  images for both Top and Bottom.');
    }
  };

  return (
    <div className="outfit-page">
      <h2>Outfit Selection</h2>

      {/* Button to open dialog for selecting Top and Bottom images */}
      <button onClick={() => openDialog('top')}>Select Top Images</button>
      <button onClick={() => openDialog('bottom')}>Select Bottom Images</button>

      {/* Display selected Top and Bottom images */}
      <div>
        <h3>Selected Top Images</h3>
        <div className="selected-images">
          {selectedTopImages.map((img, index) => (
            <img key={index} src={img} alt={`Top ${index + 1}`} width="100" />
          ))}
        </div>

        <h3>Selected Bottom Images</h3>
        <div className="selected-images">
          {selectedBottomImages.map((img, index) => (
            <img key={index} src={img} alt={`Bottom ${index + 1}`} width="100" />
          ))}
        </div>
      </div>

      {/* Dialog box for selecting images */}
      {isDialogOpen && (
        <div className="dialog">
          <h3>Select up to 3 images for {selectedCategory === 'top' ? 'Top' : 'Bottom'}</h3>
          <div className="image-gallery">
            {images.map((url, index) => (
              <div
                key={index}
                className={`image-box ${selectedCategory === 'top' ? selectedTopImages.includes(url) : selectedBottomImages.includes(url) ? 'selected' : ''}`}
                onClick={() => handleImageSelect(url)}
              >
                <img src={url} alt={`Option ${index + 1}`} width="100" />
              </div>
            ))}
          </div>
          <button onClick={() => setIsDialogOpen(false)}>Close</button>
        </div>
      )}

      {/* Generate button */}
      <button onClick={handleGenerate} disabled={selectedTopImages.length == 0 || selectedBottomImages.length == 0}>
        Generate Outfit
      </button>

       {/* Display loading state */}
       {loading && <p>Loading... Please wait while the outfit is generated.</p>}

      {/* Display AI model result */}
      {aiResult && aiResult.length > 0 && (
        <div>
          <h2>AI Generated Outfits</h2>
        {aiResult.map((imgPath, index) => (
            <img
                key={index}
                src={`http://localhost:5000/static/${imgPath}`} // Adjust if you use static folder for serving
                alt={`Generated Outfit ${index + 1}`}
                style={{ width: '200px', margin: '10px' }}
            />
        ))}
        </div>
      )}
    </div>
  );
};

export default Outfits;

