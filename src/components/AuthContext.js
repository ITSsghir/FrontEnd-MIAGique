import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrls = {
    login: "http://localhost:8080/login",
    logout: "http://localhost:8080/logout",
  };

  const [userID, setUserID] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sessionID, setSessionID] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const sessionId = localStorage.getItem('sessionID');
    if (sessionId) {
      setSessionID(sessionId);
    } else {
      setSessionID(null);
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserID(userId);
    } else {
      setUserID(null);
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      setUserRole(userRole);
    } else {
      setUserRole(null);
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
        console.log(response.headers);
        const sessionId = response.headers['session-id'];
        const userId = response.headers['user-id'];
        const userRole = response.headers['user-role'];
        setUserID(userId);
        setSessionID(sessionId);
        setUserRole(userRole);
        console.log('User authenticated:', userId, sessionId, userRole);
        localStorage.setItem('sessionID', sessionId);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', userRole);
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
      setUserID(null);
      setUserRole(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('sessionID');
      localStorage.removeItem('userRole');
    } catch (error) {
      console.error('Logout failed:', error.message);
      // Handle logout error
    }
  };

  const deleteAccount = async () => {
    const userID = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const apiUrl = `http://localhost:8080/api/${userRole}/${userID}`;
    console.log(apiUrl);
    try {
      // Call delete account API endpoint to delete user account
      await axios.delete(apiUrl, {
        headers: {
            'session-id': sessionID,
        },
      });
      setSessionID(null);
      localStorage.removeItem('sessionID');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    } catch (error) {
      console.error('Delete account failed:', error.message);
      // Handle delete account error
    }
  }
  const value = {
    userID,
    sessionID,
    userRole,
    login,
    logout,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
