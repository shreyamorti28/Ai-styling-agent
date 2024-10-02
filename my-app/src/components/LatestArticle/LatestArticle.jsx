import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LatestArticle.css'; // Your CSS file

const LatestArticle = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/everything',
          {
            params: {
              q: 'dresses',
              apiKey: '3d10bf3f1a8448a497613af5b89d9add',
              sortBy: 'publishedAt',
              pageSize: 5
            }
          }
        );
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  };

  return (
    <div className="slider-container">
      {articles.length > 0 ? (
        <>
          <button className="prev" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="slider">
            {articles.map((article, index) => (
              <div
                className={`slide ${index === currentIndex ? 'active' : ''}`}
                key={index}
              >
                <img
                  className="article-image"
                  src={article.urlToImage || 'https://via.placeholder.com/800x400'}
                  alt={article.title}
                />
                <div className="text-content">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              </div>
            ))}
          </div>
          <button className="next" onClick={nextSlide}>
            &#10095;
          </button>
        </>
      ) : (
        <p>Loading articles...</p>
      )}
    </div>
  );
};

export default LatestArticle;
