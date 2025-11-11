import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute used as a wrapper in App.jsx (e.g. <PrivateRoute><Feedpage/></PrivateRoute>)
// so it should render children when authenticated.
const PrivateRoute = ({ children }) => {
    // Login stores `userid` and `username` in localStorage.
    // Use that as the auth check so the route matches the login logic.
    const isAuthenticated = !!localStorage.getItem('userid');

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;