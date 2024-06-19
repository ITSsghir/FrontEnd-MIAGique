import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Signup.css'; // Import the CSS file for styling

const Signup = () => {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, sessionID } = useAuth();

  const apiUrl = `http://localhost:8080/register/${role}`;

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

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = async () => {
    if (!role || !email || !password) {
      setError('All fields are required');
      return false;
    }

    try {
      const response = await axios.post(apiUrl, {
        prenom: firstName,
        nom: lastName,
        email,
        password,
      });

      if (response.status !== 200) {
        throw new Error('Registration failed');
      }
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Login failed');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const registered = await handleRegister();
    if (registered) {
      const loggedIn = await handleLogin();
      if (loggedIn) {
        navigate('/');
      }
    }
  };

  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1>MIAGique</h1>
      </header>
      <div className="signup-content">
        <h2>Sign Up</h2>
        <button 
          className="results-button"
          onClick={() => navigate('/results')}
        >
          Résultats
        </button>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={handleRoleChange} required>
              <option value="">Select Role</option>
              <option value="spectateur">Spectateur</option>
              <option value="organisateur">Organisateur</option>
            </select>
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required
            />
          </div>
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
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
