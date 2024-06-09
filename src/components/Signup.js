import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Signup = () => {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const apiUrl = 'http://localhost:8080/register/' + role; 

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    if (localSessionID) {
      navigate('/');
      console.log('Already logged in');
    }
  }, [navigate]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('URL: ', apiUrl);
    if (!role || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      console.log(response);

      if (response.status !== 200) {
        throw new Error('Registration failed');
      }

      try {
        await login(email, password);
      } catch (error) {
        console.error('Login failed:', error.message);
        setError('Login failed');
        return;
      }

      navigate('/');

    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
    }
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form>
        <div>
          <label>Role:</label>
          <select value={role} onChange={handleRoleChange} required>
            <option value="">Select Role</option>
            <option value="spectateur">Spectateur</option>
            <option value="participant">Participant</option>
            <option value="controleur">Controleur</option>
            <option value="organisateur">Organisateur</option>
          </select>
        </div>
        <div>
          <label>First Name:</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required
          />
          <label>Last Name:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required
          />
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
        <button type="submit" onClick={handleSubmit}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
