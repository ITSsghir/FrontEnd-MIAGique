import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrls = {
    login: "http://localhost:8080/login",
    logout: "http://localhost:8080/logout",
    epreuves: "http://localhost:8080/api/epreuves",
    billets: "http://localhost:8080/api/billets",
  };

  const [userID, setUserID] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sessionID, setSessionID] = useState(null);
  const [epreuves, setEpreuves] = useState([]);
  const [billets, setBillets] = useState([]);

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

    // Fetch epreuves if user is logged in and userRole is 'spectateur' or 'participant' or 'organisateur'
    if (sessionId) {
      getEpreuves();
      getBillets();
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

  const getEpreuves = async () => {
    const apiUrl = apiUrls.epreuves;
    try {
      // Call get epreuves API endpoint to fetch epreuves
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Epreuves:', response.data);
      setEpreuves(response.data);
    } catch (error) {
      console.error('Get epreuves failed:', error.message);
      // Handle get epreuves error
    }
  };

  const getEpreuveById = async (epreuveId) => {
    const apiUrl = `${apiUrls.epreuves}/${epreuveId}`;
    try {
      // Call get epreuve by ID API endpoint to fetch epreuve details
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Epreuve:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get epreuve by ID failed:', error.message);
      // Handle get epreuve by ID error
    }
  };

  const getBillets = async () => {
    const apiUrl = apiUrls.billets;
    try {
      // Call get billets API endpoint to fetch billets
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Billets:', response.data);
      setBillets(response.data);
    } catch (error) {
      console.error('Get billets failed:', error.message);
      // Handle get billets error
    }
  }

  const createBillet = async (epreuveId) => {
    const apiUrl = apiUrls.billets;
    try {
      // Call create billet API endpoint to create a new billet
      const response = await axios.post(apiUrl, {
          epreuveId: epreuveId,
          spectateurId: userID,
          etat: 'Réservé',
          prix: 10,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Billet created:', response.data);
      getBillets();
    } catch (error) {
      console.error('Create billet failed:', error.message);
      // Handle create billet error
    }
  };

  const updateBillet = async (billetId, etat) => {
    const apiUrl = `${apiUrls.billets}/${billetId}`;
    try {
      // Call update billet API endpoint to update billet status
      const response = await axios.put(apiUrl, {
          etat: etat,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Billet updated:', response.data);
      getBillets();
    } catch (error) {
      console.error('Update billet failed:', error.message);
      // Handle update billet error
    }
  };

  const value = {
    userID,
    sessionID,
    userRole,
    epreuves,
    billets,
    login,
    logout,
    deleteAccount,
    createBillet,
    updateBillet,
    getEpreuveById
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
