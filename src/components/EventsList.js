import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const EventsList = () => {
  const navigate = useNavigate();
  const { epreuves, billets, createBillet, updateBillet } = useAuth();
  const [message, setMessage] = useState('');

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
    } else {
      // Search for the event in the list of billets
      const existingBillet = billets.find(billet => billet.epreuve.id === eventId);
      if (existingBillet) {
        if (existingBillet.etat === 'Réservé' || existingBillet.etat === 'Payé') {
          console.log('Ticket already reserved for event:', eventId);
          setMessage('Ticket déjà réservé pour cet événement');
        } else {
          // Update the ticket status to 'Réservé'
          updateBillet(existingBillet.id, 'Réservé');
          console.log('Update ticket status to Réservé for event:', eventId);
          setMessage('Ticket réservé avec succès');
        }
      } else {
        // Create a new ticket for the event
        createBillet(eventId);
        console.log('Create new ticket for event:', eventId);
        setMessage('Ticket créé et réservé avec succès');
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
      return;
    }

    const existingBillet = billets.find(billet => billet.epreuve.id === eventId);
    console.log('Existing billet:', existingBillet);
    // Pay for the ticket
    console.log('Pay for the ticket');
    updateBillet(existingBillet.id, 'Payé');
    setMessage('Paiement effectué avec succès');
    setTimeout(() => setMessage('Redirecting to homepage...'), 3000);
    setTimeout(() => navigate('/'), 5000);
  };

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
          <p>{epreuves.nom}</p>
          <p>{epreuves.date}</p>
          <p>{epreuves.infrastructure}</p>
          <p>{epreuves.nombrePlaces}</p>
          <button onClick={() => handleReserve(epreuves.id)}>Réserver</button>
          <button className="secondary" onClick={() => handlePay(epreuves.id)}>Payer</button>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
