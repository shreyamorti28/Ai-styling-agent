import React, { useState, useEffect } from 'react';
import './Hero.css';
import hero_image1 from '../Assets/casual.png';
import hero_image2 from '../Assets/men.jpg';
import hero_image3 from '../Assets/indian.jpg';

const slides = [
    {
        image: hero_image1,
    },
    {
        image: hero_image2,
    },
    {
        image: hero_image3,
    }
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const currentSlide = slides[currentIndex];

    return (
        <div className='hero' style={{ backgroundImage: `url(${currentSlide.image})` }}>
            <div className='hero-content'>
                <h2>Your Customized Look Awaits</h2>
            </div>
        </div>
    );
};

export default Hero;
