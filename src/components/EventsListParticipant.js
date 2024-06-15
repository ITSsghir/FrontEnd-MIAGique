import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventsListParticipant = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Appel à l'API pour récupérer le programme des épreuves
    axios.get('http://localhost:8080/api/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Erreur lors de la récupération des épreuves:', error));
  }, []);

  const handleInscription = (eventId) => {
    // Appel à l'API pour s'inscrire à une épreuve
    axios.post(`http://localhost:8080/api/events/${eventId}/inscription`)
      .then(() => setMessage('Inscription réalisée avec succès'))
      .catch(error => console.error('Erreur lors de l\'inscription:', error));
  };

  return (
    <div className="container">
      <h2>Programme des Épreuves</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <table>
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
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.infrastructure}</td>
              <td>{event.places}</td>
              <td>
                <button onClick={() => handleInscription(event.id)}>S'inscrire</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsListParticipant;
