
// components/Header.jsx
import { Link } from 'react-router-dom';
import './Header.css'; // Import CSS file for styling

export default function HeaderLogin() {

  return (
      <header className="navbar">
      <div className="navbar-container">
        {/* Logo aligned to the left */}
        <div className="navbar-logo">
          <Link to="/">
          <div style={{display:'flex'}}>            
            <img src="/logo_black.png" alt="Logo" className="logo" />
            <span className="logo-text" style={{marginRight:'100px'}}>INFYAIR</span>
          </div>
          </Link>
        </div>
      </div>
    </header>
  );
}