import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

  console.log(token);
  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If a valid token exists, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;