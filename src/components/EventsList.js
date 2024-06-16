import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const EventsList = () => {
  const navigate = useNavigate();
  const { epreuves, billets, createBillet, updateBillet, inscriptions, addInscription, removeInscription, maxParticipantsTable, updateNbParticipants } = useAuth();
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  // Inscription status for every event
  const userRole = localStorage.getItem('userRole');
  // Calculate the time difference between the current time and the event time
  const timeDifference = (eventId) => {
    const currentTime = new Date().getTime();
    console.log('Current time:', currentTime);
    const event = epreuves.find(epreuve => epreuve.id === eventId);
    console.log('Event:', event);
    const eventTime = new Date(event.date).getTime();
    console.log('Event time:', eventTime);
    
    const timeDifference = eventTime - currentTime;
    console.log('Time difference:', timeDifference);
    // Convert time difference to days
    return timeDifference / (1000 * 3600 * 24);
  };

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    console.log('sessionID:', localSessionID);
    if (!localSessionID) {
      // Redirect unauthenticated users to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleReserve = (eventId) => {
    if (!eventId) {
      console.error('Event ID is required');
      return;
    }
    // Check the tickets list for the event
    if (!billets) {
      // Create a new ticket for the event
      createBillet(eventId);
      console.log('Create new ticket for event:', eventId);
      setMessage('Ticket créé et réservé avec succès');
      setMessageColor('green');
    } else {
      // Search for the event in the list of billets
      const existingBillet = billets.find(billet => billet.epreuve.id === eventId);
      if (existingBillet) {
        if (existingBillet.etat === 'Réservé' || existingBillet.etat === 'Payé') {
          console.log('Ticket already reserved for event:', eventId);
          setMessage('Ticket déjà réservé pour cet événement');
          setMessageColor('red');
        } else {
          // Update the ticket status to 'Réservé'
          updateBillet(existingBillet.id, 'Réservé');
          console.log('Update ticket status to Réservé for event:', eventId);
          setMessage('Ticket réservé avec succès');
          setMessageColor('green');
        }
      } else {
        // Create a new ticket for the event
        createBillet(eventId);
        console.log('Create new ticket for event:', eventId);
        setMessage('Ticket créé et réservé avec succès');
        setMessageColor('green');
      }
    }
  };

  const handlePay = (eventId) => {
    if (!eventId) {
      console.error('Event ID is required');
      return;
    }

    // Search for the event in the list of billets
    if (!billets) {
      console.error('No tickets found');
      setMessage('Aucun billet trouvé');
      setMessageColor('red');
      return;
    }

    const existingBillet = billets.find(billet => billet.epreuve.id === eventId);
    console.log('Existing billet:', existingBillet);
    // Pay for the ticket
    console.log('Pay for the ticket');
    updateBillet(existingBillet.id, 'Payé');
    setMessage('Paiement effectué avec succès');
    setMessageColor('green');
    setTimeout(() => setMessage('Redirecting to homepage...'), 3000);
    setTimeout(() => navigate('/'), 5000);
  };


  const handleInscription = (eventId) => {
    // Call the API to register for an event
    console.log('Inscription for event:', eventId);
    console.log('Inscriptions:', inscriptions);
    if (inscriptions.includes(eventId)) {
      console.error('Already registered for event:', eventId);
      setMessage('Déjà inscrit pour cet événement');
      setMessageColor('red');
      return;
    }
    // Check the maximum number of participants for the event
    // The structure of maxParticipantsTable is as follows:
    // [
    //   {
    //     epreuveId: 2,
    //     maxParticipants: 10
    //   },
    //   {
    //     epreuveId: 3,
    //     maxParticipants: 20
    //   }
    // ]
    const maxParticipants = maxParticipantsTable.find(item => item.epreuveId === eventId);
    if (maxParticipants) {
      if (maxParticipants.maxParticipants > maxParticipants.nbParticipants) {
        console.log('Inscription is allowed for event:', eventId);
        addInscription(eventId);
        setMessage('Inscription réalisée avec succès');
        setMessageColor('green');
      } else {
        console.error('Maximum number of participants reached for event:', eventId);
        setMessage('Nombre maximal de participants atteint pour cet événement');
        setMessageColor('red');
      }
    } else {
      console.error('Maximum number of participants not defined for event:', eventId);
      setMessage('Nombre maximal de participants non défini pour cet événement');
      setMessageColor('red');
    }
  };

  const handleDesinscription = (eventId) => {
    // Call the API to unregister from an event
    console.log('Désinscription for event:', eventId);
    removeInscription(eventId);
    setMessage('Désinscription réalisée avec succès');
    setMessageColor('green');
    updateNbParticipants(eventId, maxParticipantsTable.nbParticipants - 1);
  }

  /*
    private int id;
    private String nom;
    private Date date;
    private String infrastructure;
    private int nombrePlaces;
  */
  return (
    <div className="container">
      <h2>Programme des épreuves</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {epreuves.map(epreuves => (
        <div key={epreuves.id} className="event-item">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nom de l'épreuve</th>
            <th>Date</th>
            <th>Infrastructure d’accueil</th>
            <th>Nombre de places mises en vente</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* 
            Display the events list from epreuves array
            Display the event ID, name, date, infrastructure, and places
            Display the Reserve button for Users with role 'spectateur'
            Display the Pay button for Users with role 'spectateur'
            Display the Inscription button (fill it with green) for Users with role 'participant' if it doesn't exist in inscriptions is false, otherwise display désinscrire button in red (fill it with red and the text in white) if the inscriptionStatus is true and the time is more than 10 days before the event date
            Dpn't repeat the key attribute in the tbody tag
          */}
          <tr>
            <td>{epreuves.id}</td>
            <td>{epreuves.nom}</td>
            <td>{epreuves.date}</td>
            <td>{epreuves.infrastructure}</td>
            <td>{epreuves.nombrePlaces}</td>
            <td>
              {userRole === 'spectateur' && (
                <>
                  <button onClick={() => handleReserve(epreuves.id)}>Réserver</button>
                  <button onClick={() => handlePay(epreuves.id)}>Payer</button>
                </>
              )}
              {userRole === 'participant' && (
                <>
                  {!inscriptions.includes(epreuves.id) && (
                  <button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleInscription(epreuves.id)}>
                    S'inscrire
                  </button>
                  )}
                  {inscriptions.includes(epreuves.id) && (timeDifference(epreuves.id) > 10) && (
                  <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDesinscription(epreuves.id)}>
                    Désinscrire
                  </button>
                  )}
                  {inscriptions.includes(epreuves.id) && (timeDifference(epreuves.id) <= 10) && (
                  <button style={{  backgroundColor: '#ffc3b7', color: 'black' }} disabled>
                    Désinscrire
                  </button>
                  )}
                </>
              )}
            </td>
          </tr>
        </tbody>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
