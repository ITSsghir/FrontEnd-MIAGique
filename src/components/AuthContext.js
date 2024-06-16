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
  const [maxParticipantsTable, setMaxParticipantsTable] = useState([]);
  const [billets, setBillets] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [delegation, setDelegation] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

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

    const OrganisateurRole = localStorage.getItem('OrganisateurRole');
    if (OrganisateurRole) {
      setRole(OrganisateurRole);
    } else {
      setRole(null);
    }

    // Fetch epreuves if user is logged in and userRole is 'spectateur' or 'participant' or 'organisateur'
    if (sessionId) {
      getUser(userId, userRole);
      getEpreuves();
      getBillets();
      getUser(userId, userRole);
      getDelegations();
      getParticipants();
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
        if (user.role) {
          localStorage.setItem('OrganisateurRole', user.role);
        } else {
          localStorage.removeItem('OrganisateurRole');
        }
        getUser(userId, userRole);
        getEpreuves();
        getBillets();
        getDelegations();
        getParticipants();
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
      setEpreuves([]);
      setInscriptions([]);
      setDelegation([]);
      setDelegations([]);
      setParticipants([]);
      setMaxParticipantsTable([]);
      setBillets([]);
      setRole(null);
      setUser(null);
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
    const apiUrl = `http://localhost:8080/api/${userRole}s/${userID}`;
    console.log(apiUrl);
    try {
      // Call delete account API endpoint to delete user account
      await axios.delete(apiUrl, {
        headers: {
            'session-id': sessionID,
        },
      });
      setSessionID(null);
      setUserID(null);
      setUserRole(null);
      setEpreuves([]);
      setInscriptions([]);
      setDelegation([]);
      setDelegations([]);
      setParticipants([]);
      setMaxParticipantsTable([]);
      setBillets([]);
      setRole(null);
      setUser(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('sessionID');
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

  const addInscription = (epreuveId) => {
    setInscriptions([...inscriptions, epreuveId]);
  }

  const removeInscription = (epreuveId) => {
    setInscriptions(inscriptions.filter((id) => id !== epreuveId));
  }

  const getUser = async (userId, userrole) => {
    // Get delegation if userRole is 'participant'
    const apiUrl = `http://localhost:8080/api/${userrole}s/${userId}`;
    console.log(apiUrl);
    try {
      // Call get user API endpoint to fetch user details
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('User:', response.data);
      setUser(response.data);
      setDelegation(response.data.delegation);
      console.log('Organisateur role:', response.data.role);
      setRole(response.data.role);
      localStorage.setItem('OrganisateurRole', response.data.role);
    } catch (error) {
      console.error('Get user failed:', error.message);
      // Handle get user error
    }
  }

  const getDelegations = async () => {
    const apiUrl = 'http://localhost:8080/api/delegations';
    try {
      // Call get delegations API endpoint to fetch delegations
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Delegations:', response.data);
      setDelegations(response.data);
    } catch (error) {
      console.error('Get delegations failed:', error.message);
      // Handle get delegations error
    }
  }

  const createDelegation = async (name, goldMedals, silverMedals, bronzeMedals) => {
    const apiUrl = 'http://localhost:8080/api/delegations';
    try {
      // Call create delegation API endpoint to create a new delegation
      const response = await axios.post(apiUrl, {
          nom: name,
          nombreMedailleOr: goldMedals,
          nombreMedailleArgent: silverMedals,
          nombreMedailleBronze: bronzeMedals,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Delegation created:', response.data);
      setDelegation(response.data);
    } catch (error) {
      console.error('Create delegation failed:', error.message);
      // Handle create delegation error
    }
  };

  const removeDelegation = async (id) => {
    const apiUrl = `http://localhost:8080/api/delegations/${id}`;
    try {
      // Call delete delegation API endpoint to delete a delegation
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setDelegations(delegations.filter(delegation => delegation.id !== id));
    } catch (error) {
      console.error('Remove delegation failed:', error.message);
      // Handle remove delegation error
    }
  };

  const createParticipant = async (firstName, lastName, email, delegation_id, password) => {
    const apiUrl = 'http://localhost:8080/api/participants';
    try {
      // Call create participant API endpoint to create a new participant
      const response = await axios.post(apiUrl, {
          prenom: firstName,
          nom: lastName,
          email: email,
          password: password,
          delegationId: delegation_id,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Participant created:', response.data);
    } catch (error) {
      console.error('Create participant failed:', error.message);
      // Handle create participant error
    }
  };

  const applyMaxParticipants = async (epreuveId, maxParticipantsPerEpreuve) => {
    const maxParticipants = {
      epreuveId: epreuveId,
      maxParticipants: maxParticipantsPerEpreuve,
    };
    setMaxParticipantsTable([...maxParticipantsTable, maxParticipants]);
  }

  const updateNbParticipants = async (epreuveId, nbParticipants) => {
    // Find the epreuve with the given ID in the maxParticipantsTable
    const epreuve = maxParticipantsTable.find(epreuve => epreuve.epreuveId === epreuveId);
    // Update the object by adding new key-value pair if it doesn't exist or updating the value if it exists
    epreuve.nbParticipants = nbParticipants;
    // Update the maxParticipantsTable
    setMaxParticipantsTable([...maxParticipantsTable]);
  }

  const getParticipants = async () => {
    const apiUrl = 'http://localhost:8080/api/participants';
    try {
      // Call get participants API endpoint to fetch participants
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Participants:', response.data);
      setParticipants(response.data);
    } catch (error) {
      console.error('Get participants failed:', error.message);
      // Handle get participants error
    }
  }

  const deleteParticipant = async (id) => {
    const apiUrl = `http://localhost:8080/api/participants/${id}`;
    try {
      // Call delete participant API endpoint to delete a participant
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setParticipants(participants.filter(participant => participant.id !== id));
    } catch (error) {
      console.error('Delete participant failed:', error.message);
      // Handle delete participant error
    }
  };

  const value = {
    userID,
    sessionID,
    userRole,
    epreuves,
    billets,
    inscriptions,
    delegation,
    delegations,
    maxParticipantsTable,
    participants,
    user,
    role,
    login,
    logout,
    deleteAccount,
    createBillet,
    updateBillet,
    getEpreuveById,
    addInscription,
    removeInscription,
    createDelegation,
    removeDelegation,
    createParticipant,
    applyMaxParticipants,
    updateNbParticipants,
    deleteParticipant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
