import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrls = {
    login: 'http://localhost:8080/login',
    logout: 'http://localhost:8080/logout',
  };
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const sessionId = localStorage.getItem('sessionID');
    if (sessionId) {
      setSessionID(sessionId);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Call login API endpoint to authenticate user
      const response = await axios.post(apiUrls.login, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const sessionId = response.headers['session-id'];
        setSessionID(sessionId);
        localStorage.setItem('sessionID', sessionId);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      throw new Error('Authentication failed');
    }
  };

  const logout = async () => {
    try {
      // Call logout API endpoint to destroy session
      await axios.post(apiUrls.logout, null, {
        headers: {
          'session-id': sessionID,
        },
      });
      setSessionID(null);
      localStorage.removeItem('sessionID');
    } catch (error) {
      console.error('Logout failed:', error.message);
      // Handle logout error
    }
  };

  const value = {
    sessionID,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
