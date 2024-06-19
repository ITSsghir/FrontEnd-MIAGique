import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling
import { useAuth } from './AuthContext';

const Login = () => {
  const [message, setMessage] = useState(''); // Add this line
  const [messageColor, setMessageColor] = useState(''); // Add this line
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, sessionID } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setMessage('Login successful');
      setMessageColor('green');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.message);
      setMessage('Login failed');
      setMessageColor('red');
    }
  };

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    if (localSessionID) {
      navigate('/');
      console.log('Already logged in');
    }
  }, [navigate]);

  useEffect(() => {
    if (sessionID) {
      navigate('/');
    }
  }, [sessionID, navigate]);

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>MIAGique</h1>
      </header>
      <div className="login-content">
        <h2>Login</h2>
        <p style={{ color: messageColor }}>{message}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <button 
          className="results-button"
          onClick={() => navigate('/results')}
        >
          Résultats
        </button>
        <p>
          Don't have an account? <Link to="/signup">Create Profile</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
