import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use axios for making the HTTP request
      const response = await axios.post('http://localhost:8080/login', {
        email: email,
        password: password,
      });

      console.log(response);
      
      // Extract the sessionID from the response headers
      const sessionID = response.headers['session-id'];
      console.log(sessionID);

      if (response.status !== 200) {
        throw new Error('Authentication failed');
      }
      setIsLoggedIn(true); // Set authentication status to true
      navigate('/spectatorHome'); // Redirect to authenticated route
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle authentication failure (e.g., display error message)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" onClick={handleSubmit}>Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Create Profile</Link>
      </p>
    </div>
  );
};

export default Login;
