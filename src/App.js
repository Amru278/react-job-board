import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import JobBoard from './components/JobBoard';
import Dashboard from './components/Dashboard/Dashboard';
import CompanyProfile from './components/CompanyProfile/CompanyProfile'; // NEW IMPORT
import { auth } from './auth';
import './App.css';
import './components/Dashboard/Dashboard.css';

// Navbar Component - REMOVED duplicate dropdown menu
const Navbar = ({ isLoggedIn, user }) => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">🎯 JobFinder</a>
      <div className="nav-menu">
        <a href="/jobs" className="nav-link">Jobs</a>
        {isLoggedIn ? (
          <>
            {/* Dashboard link - clicking this will take user to dashboard page */}
            <a href="/dashboard" className="nav-link">Dashboard</a>
            
            {/* Simple greeting - NO dropdown menu */}
            <div className="user-menu">
              <span className="user-greeting">
                👋 Hello, {user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
          </>
        ) : (
          <>
            <a href="/login" className="nav-link">Login</a>
            <a href="/signup" className="nav-button">Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());
  const [user, setUser] = useState(auth.getCurrentUser());

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = auth.isLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUser(auth.getCurrentUser());
      }
    };
    
    // Check auth status on mount
    checkAuth();
    
    // Listen for storage changes (for logout/login from other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          user={user}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Signup setIsLoggedIn={setIsLoggedIn} />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <JobBoard />
              </ProtectedRoute>
            } 
          />
          
          {/* Company Profile Route - NEW */}
          <Route 
            path="/company/:id" 
            element={
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;