import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Tickets = () => {
  const navigate = useNavigate();
  const { billets, epreuves ,updateBillet, updateStatistics, getBillets, getEpreuves } = useAuth();
  const billetsDetails = billets.map((billet) => {
    const epreuve = epreuves.find((epreuve) => epreuve.id === billet.epreuve.id);
    return { ...billet, epreuve };
  });

  useEffect(() => {
    getBillets();
    getEpreuves();
  }, [getBillets, getEpreuves]);

  const [message, setMessage] = React.useState('');
  const [messageColor, setMessageColor] = React.useState('green');


  useEffect(() => {
    // Check if user is already logged in
    const sessionId = localStorage.getItem('sessionID');
    if (!sessionId) {
      // Redirect unauthenticated users to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleCancel = async (ticketId) => {
    // Calculate the time difference between the current time and the event time
    const currentTime = new Date().getTime();
    const ticket = billetsDetails.find(billet => billet.id === ticketId);
    const eventTime = new Date(ticket.epreuve.date).getTime();
    const timeDifference = eventTime - currentTime;
    // Convert time difference to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    // If the event is more than 7 days away, cancel the ticket and refund the user
    if (daysDifference > 7) {
      // Call the API endpoint to cancel the ticket
      updateBillet(ticketId, 'Annulé');
      setMessage('Ticket annulé avec succès avec remboursement complet');
      setMessageColor('green');
      console.log('Cancel ticket:', ticketId);
    } else {
      // If the event is less than 7 days away, and more than 3 days away, cancel the ticket with a 50% refund
      if (daysDifference > 3) {
        // Call the API endpoint to cancel the ticket with a 50% refund
        updateBillet(ticketId, 'Annulé');
        setMessage('Ticket annulé avec succès avec remboursement de 50%');
        setMessageColor('green');
        console.log('Cancel ticket with 50% refund:', ticketId);
      } else {
        // If the event is less than 3 days away, cannot cancel the ticket
        setMessage('Impossible d\'annuler le ticket');
        setMessageColor('red');
        console.log('Cannot cancel ticket:', ticketId);
      }
    }
  };
  
  const handlePay = (eventId) => {
    if (!eventId) return;
    const existingBillet = billetsDetails.find(billet => billet.epreuve.id === eventId);
    if (existingBillet) {
      updateBillet(existingBillet.id, 'Payé');
      updateStatistics(existingBillet);
      setMessage('Paiement effectué avec succès');
      setMessageColor('green');
    } else {
      setMessage('Aucun billet trouvé');
      setMessageColor('red');
    }
  };


  return (
    <div className="container">
      <h2>Mes Billets</h2>
      {/* if the ticket is cancelable, display the message in green color, otherwise display the message in red color */}
      <p style={{ color: messageColor }}>{message}</p>
      <table>
        <thead>
          <tr>
            <th>Billet ID</th>
            <th>Epreuve</th>
            <th>Date</th>
            <th>Prix</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {billetsDetails.map((billet) => (
            <tr key={billet.id}>
              <td>{billet.id}</td>
              <td>{billet.epreuve.nom}</td>
              <td>{billet.epreuve.date}</td>
              <td>{billet.prix}</td>
              <td>{billet.etat}</td>
              {/* Display Annuler button only if ticket status is 'Payé', and Display Payer button only if ticket status is 'Réservé' */}
              {billet.etat === 'Payé' && (
                <td>
                  <button onClick={() => handleCancel(billet.id)}>Annuler</button>
                </td>
              )}
              {billet.etat === 'Réservé' && (
                <td>
                  <button onClick={() => handlePay(billet.epreuve.id)}>Payer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;