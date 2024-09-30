

import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useLocation } from 'react-router-dom';
import Users from './components/Auth/Users';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductForm from './components/Auth/ProductForm';
import ProductTable from './components/Auth/ProductTable';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import HeaderLogin from './components/HeaderLogin';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import FooterLogin from './components/FooterLogin';

const HeaderComponent = ({ username, role }) => {
  const location = useLocation();

  return location.pathname === '/' ? <HeaderLogin /> : <Header username={username} role={role} />;
};

const FooterComponent = () => {
  const location = useLocation();

  return location.pathname === '/' ? <FooterLogin /> : <Footer />;
};


function App() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Load from localStorage when component mounts
    setUsername(localStorage.getItem('username') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);

  // Handle login and update username and role
  const handleLogin = (user) => {
    console.log("App vala", user);
    setUsername(user.username);
    setRole(user.role);
    localStorage.setItem('username', user.username); // Save username on login
    localStorage.setItem('role', user.role); // Save role on login
  };

  return (
    <>
      <HeaderComponent username={username} role={role} />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/productForm" element={<ProductForm />} />
          
          {/* Pass handleLogin to ProductTable */}
          <Route path="/productTable" element={<ProductTable username={username} />} />
        </Route>
      </Routes>
      <FooterComponent />

    </>
  );
}

export default App;

