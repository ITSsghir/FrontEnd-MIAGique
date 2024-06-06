import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, sessionID } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to homepage
    if (sessionID) {
      navigate('/Home');
    }
  }, [navigate, sessionID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/Home'); // Redirect to homepage after successful login
    } catch (error) {
      console.error('Login failed:', error.message);
      // Handle login error (display error message, clear form fields, etc.)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Create Profile</Link>
      </p>
    </div>
  );
};

export default Login;
