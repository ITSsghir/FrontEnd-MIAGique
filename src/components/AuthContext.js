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
  const [controleurs, setControleurs] = useState([]); // [1
  const [infrastructures, setInfrastructures] = useState([]);
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
      getInfrastructures();
      getControllers();
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
        const userId = response.headers['user-id'];
        const userRole = response.headers['user-role'];
        setUserID(userId);
        setSessionID(sessionId);
        setUserRole(userRole);
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
        getControllers();
        getInfrastructures();
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
      setControleurs([]);
      setMaxParticipantsTable([]);
      setInfrastructures([]);
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
      setControleurs([]);
      setMaxParticipantsTable([]);
      setInfrastructures([]);
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

  const getInfrastructures = async () => {
    const apiUrl = 'http://localhost:8080/api/infrastructuresportives';
    try {
      // Call get infrastructures API endpoint to fetch infrastructures
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setInfrastructures(response.data);
    } catch (error) {
      console.error('Get infrastructures failed:', error.message);
      // Handle get infrastructures error
    }
  }

  const createInfrastructure = async (name, location, capacity) => {
    const apiUrl = 'http://localhost:8080/api/infrastructuresportives';
    try {
      // Call create infrastructure API endpoint to create a new infrastructure
      const response = await axios.post(apiUrl, {
          nom: name,
          adresse: location,
          capacite: capacity,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      getInfrastructures();
    } catch (error) {
      console.error('Create infrastructure failed:', error.message);
      // Handle create infrastructure error
    }
  };

  const updateInfrastructure = async (infrastructureId, name, location, capacity) => {
    const apiUrl = `http://localhost:8080/api/infrastructuresportives/${infrastructureId}`;
    // check if the infrastructureId is valid
    if (!infrastructureId) {
      console.error('Infrastructure ID is required');
      return;
    }
    // Check if capacity is a number
    if (isNaN(capacity)) {
      console.error('Capacité must be a number');
      return;
    }
    // If one field is not provided, keep the existing value
    const updatedInfrastructure = {
      nom: name,
      adresse: location,
      capacite: capacity,
    };

    try {
      // Call update infrastructure API endpoint to update infrastructure details
      const response = await axios.put(apiUrl, updatedInfrastructure, {
        headers: {
          'session-id': sessionID,
        },
      });
      getInfrastructures();
    } catch (error) {
      console.error('Update infrastructure failed:', error.message);
      // Handle update infrastructure error
    }
  };

  const deleteInfrastructure = async (infrastructureId) => {
    const apiUrl = `http://localhost:8080/api/infrastructuresportives/${infrastructureId}`;
    try {
      // Call delete infrastructure API endpoint to delete an infrastructure
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setInfrastructures(infrastructures.filter(infrastructure => infrastructure.id !== infrastructureId));
    } catch (error) {
      console.error('Delete infrastructure failed:', error.message);
      // Handle delete infrastructure error
    }
  };


  const getEpreuves = async () => {
    const apiUrl = apiUrls.epreuves;
    try {
      // Call get epreuves API endpoint to fetch epreuves
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
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
      return response.data;
    } catch (error) {
      console.error('Get epreuve by ID failed:', error.message);
      // Handle get epreuve by ID error
    }
  };

  const createEpreuve = async (name, date, infrastructure, nbPlaces) => {
    const apiUrl = apiUrls.epreuves;
    try {
      // Call create epreuve API endpoint to create a new epreuve
      const response = await axios.post(apiUrl, {
          nom: name,
          date: date,
          infrastructure: infrastructure,
          nombrePlaces: nbPlaces,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      getEpreuves();
    } catch (error) {
      console.error('Create epreuve failed:', error.message);
      // Handle create epreuve error
    }
  };

  const updateEpreuve = async (epreuveId, name, date, infrastructure, nbPlaces) => {
    const apiUrl = `${apiUrls.epreuves}/${epreuveId}`;
    // check if the epreuveId is valid
    if (!epreuveId) {
      console.error('Epreuve ID is required');
      return;
    }
    // Check if nbPlaces is a number
    if (isNaN(nbPlaces)) {
      console.error('Nombre de places must be a number');
      return;
    }
    // If one field is not provided, keep the existing value
    const updatedEpreuve = {
      nom: name,
      date: date,
      infrastructure: infrastructure,
      nombrePlaces: nbPlaces,
    };
    try {
      // Call update epreuve API endpoint to update epreuve details
      const response = await axios.put(apiUrl, updatedEpreuve, {
        headers: {
          'session-id': sessionID,
        },
      });
      getEpreuves();
    } catch (error) {
      console.error('Update epreuve failed:', error.message);
      // Handle update epreuve error
    }
  };

  const deleteEpreuve = async (epreuveId) => {
    const apiUrl = `${apiUrls.epreuves}/${epreuveId}`;
    try {
      // Call delete epreuve API endpoint to delete an epreuve
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setEpreuves(epreuves.filter(epreuve => epreuve.id !== epreuveId));
    } catch (error) {
      console.error('Delete epreuve failed:', error.message);
      // Handle delete epreuve error
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
    try {
      // Call get user API endpoint to fetch user details
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setUser(response.data);
      setDelegation(response.data.delegation);
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
      setParticipants(response.data);
    } catch (error) {
      console.error('Get participants failed:', error.message);
      // Handle get participants error
    }
  }

  const updateParticipant = async (id, firstName, lastName, email, delegation_id) => {
    const apiUrl = `http://localhost:8080/api/participants/${id}`;
    try {
      // Call update participant API endpoint to update a participant
      const response = await axios.put(apiUrl, {
          prenom: firstName,
          nom: lastName,
          email: email,
          delegationId: delegation_id,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
    } catch (error) {
      console.error('Update participant failed:', error.message);
      // Handle update participant error
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

  const createController = async (prenom, nom, email, password) => {
    const apiUrl = 'http://localhost:8080/api/organisateurs';
    try {
      // Call create controller API endpoint to create a new controller
      const response = await axios.post(apiUrl, {
          nom: nom,
          prenom: prenom,
          email: email,
          password: password,
          role: 'controleur',
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
    } catch (error) {
      console.error('Create controller failed:', error.message);
      // Handle create controller error
    }
  };

  const getControllers = async () => {
    const apiUrl = 'http://localhost:8080/api/organisateurs';
    try {
      // Call get controllers API endpoint to fetch controllers
      const response = await axios.get(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      const controllers = response.data.filter(controller => controller.role === 'controleur');
      setControleurs(controllers);
    } catch (error) {
      console.error('Get controllers failed:', error.message);
      // Handle get controllers error
    }
  }

  const updateController = async (id, nom, prenom, email, password) => {
    const apiUrl = `http://localhost:8080/api/organisateurs/${id}`;
    try {
      // Call update controller API endpoint to update a controller
      const response = await axios.put(apiUrl, {
          nom: nom,
          prenom: prenom,
          email: email,
          password: password,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      setControleurs(controleurs.map(controller => controller.id === id ? response.data : controller));
    } catch (error) {
      console.error('Update controller failed:', error.message);
      // Handle update controller error
    }
  };

  const deleteController = async (id) => {
    const apiUrl = `http://localhost:8080/api/organisateurs/${id}`;
    try {
      // Call delete controller API endpoint to delete a controller
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setControleurs(controleurs.filter(controller => controller.id !== id));
    } catch (error) {
      console.error('Delete controller failed:', error.message);
      // Handle delete controller error
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
    controleurs,
    user,
    role,
    login,
    logout,
    deleteAccount,
    infrastructures,
    createBillet,
    updateBillet,
    getEpreuves,
    getEpreuveById,
    createEpreuve,
    updateEpreuve,
    deleteEpreuve,
    addInscription,
    removeInscription,
    getDelegations,
    createDelegation,
    removeDelegation,
    createParticipant,
    applyMaxParticipants,
    updateNbParticipants,
    getParticipants,
    deleteParticipant,
    updateParticipant,
    createController,
    getControllers,
    updateController,
    deleteController,
    getInfrastructures,
    createInfrastructure,
    updateInfrastructure,
    deleteInfrastructure
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
