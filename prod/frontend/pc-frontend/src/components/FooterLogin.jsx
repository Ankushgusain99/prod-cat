import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const FooterLogin = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo" >
        <img className='logo' src="/logo_bw.png" alt='logo'/>
        <h2>INFYAIR</h2>
        </div>
        <div className="footer__links" style={{gap:'15px'}}>
          <Link to="/" className="footer__link" >Home</Link>
          <Link to="/about" className="footer__link" >About</Link>
          <Link to="/services" className="footer__link" >Services</Link>
          <Link to="/technology" className="footer__link" >Technology</Link>
          <Link to="/projects" className="footer__link" >Projects</Link>
          <Link to="/careers" className="footer__link" >Careers</Link>
          <Link to="/contact" className="footer__link" >Contact</Link>
        </div> 
        <div className="footer__social" style={{color:"white"}}>
          <p>Stay Connected</p>
          <div className="footer__social-links">
            <a href="https://www.facebook.com/INFYAIR" target='/_blank' rel="noreferrer"><img src="/icon5.svg" alt="Social Icon" /></a>
            <a href="https://www.instagram.com/infyair/" target='/_blank' rel="noreferrer"><img src="/icon6.svg" alt="Social Icon"/></a>
            <a href="https://www.linkedin.com/company/infyair/" target='/_blank' rel="noreferrer"><img src="/icon7.svg" alt="Social Icon" /></a>
          </div>
        </div>
      </div>
      <div className="footer__bottom" >
        <div className="footer__contact">
          <div className="footer__contact-item">
            <img src="/icon8.svg" alt="Email Icon" />
            <span>info@infyair.com </span>
          </div>
          <div className="footer__contact-item">
            <img src="/icon9.svg" alt="Phone Icon" />
            <span>+39 342 137 7523</span>
          </div>
          <div className="footer__contact-item">
            <img src="/icon10.svg" alt="Location Icon" />
            <a href='https://maps.app.goo.gl/bXoLhaZKc4a36sL66' target='__blank' className='maps'>Via Mariotto Albertinelli, 4 Milano (MI) 20148</a>
          </div>
        </div>
        <p className="footer__copyright" style={{color:'#98989A'}}>&copy; 2023 INFYAIR SRL All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterLogin;