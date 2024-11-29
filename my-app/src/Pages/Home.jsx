import React from 'react'
import Hero from '../components/Hero/Hero';
import NewsLetter from '../components/NewsLetter/NewsLetter';
import './CSS/Home.css'


const Home = () => {
  return (
    <div className='home'>
        <Hero/>
        <NewsLetter/>


        
    </div>
  )
}

export default Home