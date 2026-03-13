import React from 'react';
import './HomeFarmingImages.css';

const images = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
];

const HomeFarmingImages = () => (
  <div className="farming-images-row">
    {images.map((img, idx) => (
      <div className="farming-img-wrap" key={idx} style={{ animationDelay: `${0.2 + idx * 0.12}s` }}>
        <img src={img} alt="Farming" className="farming-img" />
      </div>
    ))}
  </div>
);

export default HomeFarmingImages;
