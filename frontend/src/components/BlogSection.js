import React from 'react';
import './BlogSection.css';

const BlogSection = () => {
  return (
    <section className="section-block blog-section">
      <h2>Latest Blog</h2>
      <div className="blog-content">
        <div className="blog-info">
          <h3>Discover insights, tips, and stories about organic living, straight from the heart of 6seasonsorganic.</h3>
          <a
            href="https://6seasonsorganic.blogspot.com/2023/11/6seasons-organic.html"
            className="blog-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Our Latest Blog
          </a>
        </div>
        <div className="blog-images">
          <img src="https://6seasonsorganic.com/images/insta5.jpeg" alt="6 Seasons Organic Blog 1" />
          <img src="https://6seasonsorganic.com/images/insta6.jpeg" alt="6 Seasons Organic Blog 2" />
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
