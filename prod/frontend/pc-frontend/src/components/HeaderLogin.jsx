// components/Header.jsx
import { Link } from "react-router-dom";
import "./Header.css"; // Import CSS file for styling

export default function HeaderLogin() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo aligned to the left */}
        <div className="navbar-logo">
          <Link to="/">
            <div style={{ display: "flex" }}>
              <img src="/logo_bw.png" alt="Logo" className="logo" />
              <h2 className="logo-text">
                INFYAIR
              </h2>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
