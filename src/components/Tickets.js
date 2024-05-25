import React, { useState } from 'react';

const Tickets = () => {
  const [tickets, setTickets] = useState([
    { id: 1, eventId: 101, spectatorId: 1001, price: 50, status: 'réservé' },
    { id: 2, eventId: 102, spectatorId: 1002, price: 70, status: 'payé' },
  ]);

  const handleCancel = async (ticketId) => {
    console.log('API call to cancel reservation', ticketId);

    try {
      const response = await fetch(`https://api.example.com/cancel/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      // Mettre à jour l'état pour refléter l'annulation
      setTickets(prevTickets => 
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: 'annulé' } : ticket
        )
      );

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to cancel reservation');
    }
  };

  return (
    <div className="container">
      <h2>Mes Billets</h2>
      <table>
        <thead>
          <tr>
            <th>Billet ID</th>
            <th>ID de l'épreuve</th>
            <th>ID du spectateur</th>
            <th>Prix</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.eventId}</td>
              <td>{ticket.spectatorId}</td>
              <td>{ticket.price}</td>
              <td>{ticket.status}</td>
              <td>
                {ticket.status === 'réservé' && (
                  <button className="danger" onClick={() => handleCancel(ticket.id)}>Annuler réservation</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;
