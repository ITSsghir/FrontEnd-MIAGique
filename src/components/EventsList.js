import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsList = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const events = [
    { id: 1, name: 'Event 1' },
    { id: 2, name: 'Event 2' },
  ];

  const handleReserve = (eventId) => {
    console.log('API call to reserve', eventId);
    setMessage('La réservation est faite avec succès');
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handlePay = () => {
    navigate('/payment');
    setMessage('Le paiement est fait avec succès');
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <div className="container">
      <h2>Programme des épreuves</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {events.map(event => (
        <div key={event.id} className="event-item">
          <p>{event.name}</p>
          <button onClick={() => handleReserve(event.id)}>Réserver</button>
          <button className="secondary" onClick={handlePay}>Payer</button>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
