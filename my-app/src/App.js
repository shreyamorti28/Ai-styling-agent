import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from './components/Footer/Footer';
import LoginSignup from './Pages/LoginSignup';
import Outfits from './Pages/Outfits';
import Wardrobe from './Pages/Wardrobe';
import Navbar from './components/Navbar/Navbar';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [images, setImages] = useState([]); //to remove

  // Function to handle AI model processing
  const onGenerateAIResult = async (topImages, bottomImages) => {
    // Placeholder for the AI integration logic. Replace with actual API call to AI model.
    console.log('Selected Top Images:', topImages);
    console.log('Selected Bottom Images:', bottomImages);

    // Simulate AI result as a URL (replace this with the actual AI response)
    const aiResultUrl = "https://path-to-ai-generated-outfit.png";

    return aiResultUrl; // Return the AI-generated image URL or result
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/outfits' element={<Outfits images={images} onGenerateAIResult={onGenerateAIResult}/>} />
          <Route path='/wardrobe' element={<Wardrobe isAuthenticated={isAuthenticated} setImages={setImages} images={images} />} />
          <Route path='/login' element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
