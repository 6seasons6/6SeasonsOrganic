import React from 'react';
import './Contact.css';

const Contact = () => (
  <div className="contact-container">
    <h1>Contact Us</h1>
    <div className="contact-details">
      <b>Address:</b> Devarayamjal, Medchal, Telangana 500078<br />
      <b>Phone:</b> <a href="tel:+919100066659">+91-9100066659</a><br />
      <b>Email:</b> <a href="mailto:info@6seasonsorganic.com">info@6seasonsorganic.com</a>
    </div>
    <div className="contact-business">
      <b>Business Time:</b><br />
      Monday - Friday: 08.00am to 05.00pm<br />
      Saturday: 10.00am to 08.00pm<br />
      Sunday: Closed
    </div>
    <div className="contact-social">
      <a href="https://www.instagram.com/6_seasons_organic/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="https://www.facebook.com/people/6-seasons/61552154805127/?sfnsn=wiwspmo&mibextid=vk8aRt" target="_blank" rel="noopener noreferrer">Facebook</a>
      <a href="https://www.youtube.com/@6seasonsorganics" target="_blank" rel="noopener noreferrer">YouTube</a>
    </div>
  </div>
);

export default Contact;
