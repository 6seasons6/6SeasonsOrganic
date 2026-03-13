import React, { useEffect, useState } from 'react';
import './HomePopper.css';

const poppers = [
  {
    icon: '🌱',
    text: '100% Organic & Fresh',
  },
  {
    icon: '🚚',
    text: 'Fast Delivery',
  },
  {
    icon: '⭐',
    text: 'Best Seller Products',
  },
  {
    icon: '💚',
    text: 'Loved by 10,000+ Customers',
  },
  {
    icon: '🛒',
    text: 'Shop Now & Save',
  },
];

const HomePopper = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 600);
    const handleScroll = () => {
      if (window.scrollY > 40) setShow(false);
      else setShow(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className={`home-popper-container${show ? ' show' : ''}`}> 
      {poppers.map((pop, idx) => (
        <div className="home-popper" key={idx} style={{ animationDelay: `${0.2 + idx * 0.15}s` }}>
          <span className="popper-icon">{pop.icon}</span>
          <span className="popper-text">{pop.text}</span>
        </div>
      ))}
    </div>
  );
};

export default HomePopper;
