import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrls = {
    spectateur: 'https://api.example.com/spectateur',
    participant: 'https://api.example.com/participant',
    controleur: 'https://api.example.com/controleur',
    organisateur: 'https://api.example.com/organisateur',
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !email || !password) {
      setError('All fields are required');
      return;
    }

    const apiUrl = apiUrls[role];

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      console.log('Account created:', data);

      if (role === 'spectateur') {
        navigate('/spectator-home');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create account');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
