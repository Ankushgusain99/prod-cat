// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
// import { useNavigate } from 'react-router-dom';
// import './Header.css'; // Import CSS file for styling
// import LeftDrawer from './Auth/Options';
// import { useEffect, useState } from 'react';

// function Header({ username,role }) {
//   const [storedUsername, setStoredUsername] = useState(username || '');

//   const navigate = useNavigate();
//   console.log("header vala", username);

//   // Fetch username from localStorage
//   useEffect(() => {
//     setStoredUsername(username);
//   }, [username]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username'); // Clear username from localStorage
//     localStorage.removeItem('role'); // Clear username from localStorage
//     navigate('/');
//   };

//   return (
//     <>
//       <header className="navbar">
//         <div className="navbar-container">
//           {/* Logo aligned to the left */}
//           <div className="navbar-logo">

//               <div style={{ display: 'flex' }}>
//                 <img src="/logo_black.png" alt="Logo" className="logo" />
//                 <span className="logo-text">INFYAIR</span>
//               </div>

//           </div>
//            <AccountCircleOutlinedIcon style={{ fontSize: '60px', color: 'white',marginTop:'40px',marginLeft:'630px' }} />
//            <span className="nav-text" style={{ marginTop:'50px' }}>
//              Hello, <br /> {storedUsername}
//             </span>
//           {/* Username and Logout button aligned to the right */}
//           <div className="navbar-right">
//             {/* Explicitly set the size and color of the icon */}
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>
//       <div className="drawer">
//       {role !== 'user' && <LeftDrawer />}

//       </div>
//     </>
//   );
// }

// export default Header;

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Import CSS file for styling
import LeftDrawer from "./Auth/Options";
import { useEffect, useState } from "react";

function Header({ username, role }) {
  const [storedUsername, setStoredUsername] = useState(username || "");

  const navigate = useNavigate();
  console.log("header vala", username);

  // Fetch username from localStorage
  useEffect(() => {
    setStoredUsername(username);
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // Clear username from localStorage
    localStorage.removeItem("role"); // Clear username from localStorage
    navigate("/");
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          {/* Logo aligned to the left */}
          <div className="navbar-logo">
            <div style={{ display: "flex" }}>
              <img src="/logo_black.png" alt="Logo" className="logo" />
              <span className="logo-text">INFYAIR</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "white",
              position: "absolute",
              right: "120px",
              marginTop: "10px" /* marginLeft:'805px' */,
            }}
          >
            <AccountCircleOutlinedIcon
              style={{ fontSize: "60px", color: "white" }}
            />

            <span
              style={{ /*marginTop:'10px',*/ padding: "7px 15px 10px 5px" }}
            >
              Hello, <br /> {storedUsername}
            </span>
            {/* Commented */}
          </div>

          {/* Username and Logout button aligned to the right */}
          <div className="navbar-right" style={{ marginRight: "30px" }}>
            {/* Explicitly set the size and color of the icon */}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="drawer">{role !== "user" && <LeftDrawer />}</div>
    </>
  );
}

export default Header;
