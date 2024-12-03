import React, { useState } from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = () => {
    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Simulate subscription success
    setMessage(`Thank you for subscribing with ${email}!`);
    setEmail(''); // Clear the email input
  };

  return (
    <div className="newsletter">
      <h1>Stay Updated with the Latest Fashion Trends</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input
          type="email"
          placeholder="Your Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewsLetter;
