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
  const [AllInscriptions, setAllInscriptions] = useState([]);
  const [delegation, setDelegation] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [controleurs, setControleurs] = useState([]);
  const [spectateurs, setSpectateurs] = useState([]);
  const [infrastructures, setInfrastructures] = useState([]);
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [statistics, setStatistics] = useState([]);

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

    const stats = localStorage.getItem('statistics');
    if (stats) {
      setStatistics(JSON.parse(stats));
    } else {
      setStatistics([]);
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
      getSpectateurs();
    }
    getResults();
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
        getResults();
        getSpectateurs();
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
      setAllInscriptions([]);
      setDelegation([]);
      setDelegations([]);
      setParticipants([]);
      setControleurs([]);
      setMaxParticipantsTable([]);
      setInfrastructures([]);
      setBillets([]);
      setRole(null);
      setUser(null);
      setSpectateurs([]);
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
      setAllInscriptions([]);
      setDelegation([]);
      setDelegations([]);
      setParticipants([]);
      setControleurs([]);
      setMaxParticipantsTable([]);
      setInfrastructures([]);
      setBillets([]);
      setRole(null);
      setUser(null);
      setSpectateurs([]);
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
      await axios.post(apiUrl, {
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
    console.log('Deleting epreuve', epreuveId);
    const apiUrl = `${apiUrls.epreuves}/${epreuveId}`;
    console.log('API URL', apiUrl);
    try {
      // Call delete epreuve API endpoint to delete an epreuve
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      console.log('Epreuve deleted successfully');
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

      if (etat === 'Payé') {
        await updateEpreuve(response.data.epreuveId, response.data.epreuve.nom, response.data.epreuve.date, response.data.epreuve.infrastructure, response.data.epreuve.nombrePlaces - 1);
        const epreuve = epreuves.find(epreuve => epreuve.id === response.data.epreuveId);
        const vente = {
          id: response.data.billetId,
          epreuve: epreuve,
          prix: response.data.prix,
          date: new Date(response.data.date).toLocaleString(),
        }
        setStatistics([...vente]);
      } else if (etat === 'Annulé') {
        await updateEpreuve(response.data.epreuveId, response.data.epreuve.nom, response.data.epreuve.date, response.data.epreuve.infrastructure, response.data.epreuve.nombrePlaces + 1);
        // Remove the statistics entry for the cancelled ticket
        setStatistics(statistics.filter(statistic => statistic.id !== billetId));
      }
      getBillets();
    } catch (error) {
      console.error('Update billet failed:', error.message);
      // Handle update billet error
    }
  };

  const addInscription = (epreuveId) => {
    const inscription = {
      epreuveId: epreuveId,
      participantId: userID,
    };
    setAllInscriptions([...AllInscriptions, inscription]);
  }

  const removeInscription = (epreuveId) => {
    // Find the inscription with the given epreuveId and participantId in the AllInscriptions array
    const inscriptionDeleted = AllInscriptions.find(inscription => inscription.epreuveId === epreuveId && inscription.participantId === userID);
    // Remove the inscription from the AllInscriptions array
    setAllInscriptions(AllInscriptions.filter(inscription => inscription !== inscriptionDeleted));
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

  const updateDelegation = async (id, name, goldMedals, silverMedals, bronzeMedals) => {
    const apiUrl = `http://localhost:8080/api/delegations/${id}`;
    if (!id) {
      console.error('Delegation ID is required');
      return;
    }
    // If one field is not provided, keep the existing value

    try {
      // Call update delegation API endpoint to update a delegation
      const response = await axios.put(apiUrl, {
          nom: name || delegation.nom,
          nombreMedailleOr: goldMedals || delegation.nombreMedailleOr,
          nombreMedailleArgent: silverMedals || delegation.nombreMedailleArgent,
          nombreMedailleBronze: bronzeMedals || delegation.nombreMedailleBronze,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      setDelegation(response.data);
    } catch (error) {
      console.error('Update delegation failed:', error.message);
      // Handle update delegation error
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

  const getResults = async () => {
    const apiUrl = 'http://localhost:8080/api/resultats';
    try {
      // Call get results API endpoint to fetch results
      const response = await axios.get(apiUrl);
      setResults(response.data);
    } catch (error) {
      console.error('Get results failed:', error.message);
      // Handle get results error
    }
  }

  const createResult = async (epreuveId, participantId, temps, position) => {

    const apiUrl = 'http://localhost:8080/api/resultats';
    try {
      // Call create result API endpoint to create a new result
      const response = await axios.post(apiUrl, {
          epreuveId: epreuveId,
          participantId: participantId,
          temps: temps,
          position: position,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
    } catch (error) {
      console.error('Create result failed:', error.message);
      // Handle create result error
      throw new Error('Create result failed');
    }
  }

  const updateResult = async (id, epreuveId, participantId, temps, position) => {
    const apiUrl = `http://localhost:8080/api/resultats/${id}`;
    try {
      // Call update result API endpoint to update a result
      const response = await axios.put(apiUrl, {
          epreuveId: epreuveId,
          participantId: participantId,
          temps: temps,
          position: position,
        }, {
        headers: {
          'session-id': sessionID,
        },
      });
      setResults(results.map(result => result.id === id ? response.data : result));
    } catch (error) {
      console.error('Update result failed:', error.message);
      // Handle update result error
    }
  }

  const deleteResult = async (epreuveId, participantId) => {
    // Get the result ID by filtering the results array with the given epreuveId and participantId
    const result = results.find(result => result.epreuveId === epreuveId && result.participantId === participantId);
    const id = result.id;
    const apiUrl = `http://localhost:8080/api/resultats/${id}`;
    try {
      // Call delete result API endpoint to delete a result
      await axios.delete(apiUrl, {
        headers: {
          'session-id': sessionID,
        },
      });
      setResults(results.filter(result => result.id !== id));
    } catch (error) {
      console.error('Delete result failed:', error.message);
      // Handle delete result error
    }
  }

  const getSpectateurs = () => {
    const apiUrl = 'http://localhost:8080/api/spectateurs';
    try {
      // Call get spectateurs API endpoint to fetch spectateurs
      const response = axios.get(apiUrl);
      setSpectateurs(response.data);
    } catch (error) {
      console.error('Get spectateurs failed:', error.message);
      // Handle get spectateurs error
    }
  }

  const updateStatistics = (billet) => {
    const epreuve = epreuves.find(epreuve => epreuve.id === billet.epreuve.id);
    const spectateur = spectateurs.find(spectateur => spectateur.id === userID);
    const vente = {
      id: billet.id,
      epreuve: epreuve,
      prix: billet.prix,
      date: new Date().toLocaleString(),
      spectateur: spectateur,
    };
    setStatistics(prevStats => [...prevStats, vente]);
    localStorage.setItem('statistics', JSON.stringify(statistics));
  };

  const value = {
    userID,
    sessionID,
    userRole,
    epreuves,
    billets,
    AllInscriptions,
    delegation,
    delegations,
    maxParticipantsTable,
    participants,
    controleurs,
    results,
    user,
    role,
    statistics,
    login,
    logout,
    deleteAccount,
    infrastructures,
    getBillets,
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
    updateDelegation,
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
    deleteInfrastructure,
    getResults,
    createResult,
    updateResult,
    deleteResult,
    updateStatistics,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
