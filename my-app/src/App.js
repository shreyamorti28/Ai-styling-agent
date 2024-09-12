import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Footer from './components/Footer/Footer';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Outfits from './Pages/Outfits';
import Wardrobe from './Pages/Wardrobe';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/outfits' element={<Outfits />} />
          <Route path='/wardrobe' element={<Wardrobe />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
