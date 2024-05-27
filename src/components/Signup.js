import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrls = {
    spectateur: 'http://localhost:8080/register/spectateur',
    participant: 'https://api.example.com/participant',
    controleur: 'https://api.example.com/controleur',
    organisateur: 'https://api.example.com/organisateur',
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (!role || !email || !password) {
      setError('All fields are required');
      return;
    }

    const apiUrl = apiUrls[role];
    console.log('apiUrl:', apiUrl);
    
    const body = {
      "nom": "test",
      "prenom": "here",
      "email": email,
      "password": password,
    };
    console.log('body:', body);
    console.log('apiUrl:', apiUrl);

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            // Apply cors headers to bypass CORS issue
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: body,
    }).catch((error) => {
      console.error('error:', error);
    });

    if (response.ok) {
      console.log('response:', response);
      navigate('/login');
    } else {
      console.error('response:', response);
      setError('An error occurred. Please try again later.');
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
