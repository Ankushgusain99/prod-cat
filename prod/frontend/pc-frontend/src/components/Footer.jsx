import { Typography } from "@mui/material";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo">
          <img src="/logo_black.png" alt="Logo" />
        </div>
        <div className="footer-text">
          <strong>INFYAIR</strong>
        </div>

        <div className="footer-social-text">
          <Typography>Stay Connected</Typography>
        </div>

        <div className="footer__social">
          <div className="footer__social-links">
            <a
              href="https://www.facebook.com/INFYAIR"
              target="/_blank"
              rel="noreferrer"
            >
              <img src="/icon5.svg" alt="Social Icon" />
            </a>
            <a
              href="https://www.instagram.com/infyair/"
              target="/_blank"
              rel="noreferrer"
            >
              <img src="/icon6.svg" alt="Social Icon" />
            </a>
            <a
              href="https://www.linkedin.com/company/infyair/"
              target="/_blank"
              rel="noreferrer"
            >
              <img src="/icon7.svg" alt="Social Icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__contact">
          <div className="footer__contact-item">
            <img src="/icon8.svg" alt="Email Icon" />
            <a
              href="https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRlQQNTLMkXzxhNRSXzZGsPVhqgHrHKKXnWPHqvdrlCMPszlHlZwtHjWWQmvNzGCXWpqLXB"
              style={{ color: "white" }}
            >
              info@infyair.com{" "}
            </a>
          </div>
          <div className="footer__contact-item">
            <img src="/icon9.svg" alt="Phone Icon" />
            <span style={{ color: "white" }}>+39 342 137 7523</span>
          </div>
          <div className="footer__contact-item">
            <img src="/icon10.svg" alt="Location Icon" />
            <a
              href="https://maps.app.goo.gl/bXoLhaZKc4a36sL66"
              target="__blank"
              className="maps"
            >
              Via Mariotto Albertinelli, 4 Milano (MI) 20148
            </a>
          </div>
        </div>
        <p className="footer__copyright" style={{ color: "white" }}>
          &copy; 2023 INFYAIR SRL All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;