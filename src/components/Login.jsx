import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../auth';
import './Auth.css'; // We'll create this CSS file

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const result = auth.login(email, password);
      
      if (result.success) {
        setIsLoggedIn(true);
        navigate('/jobs'); // Redirect to jobs page
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail('user@example.com');
    setPassword('password123');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h2>Welcome Back 👋</h2>
          <p>Login to your account</p>
          
          {error && <div className="error-message">⚠️ {error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <button 
              type="button" 
              onClick={handleDemoLogin}
              className="demo-btn"
            >
              Use Demo Account
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="link-btn"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;