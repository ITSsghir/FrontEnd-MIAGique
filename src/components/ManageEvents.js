import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await axios.get('http://localhost:8080/api/events');
      setEvents(result.data);
    };
    fetchEvents();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
      alert('Épreuve supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'épreuve', error);
      alert('Erreur lors de la suppression de l\'épreuve');
    }
  };

  const handleUpdate = async (id, newDate) => {
    try {
      await axios.put(`http://localhost:8080/api/events/${id}`, {
        date: newDate
      });
      alert('Date de l\'épreuve mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la date de l\'épreuve', error);
      alert('Erreur lors de la mise à jour de la date de l\'épreuve');
    }
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState('');

  const handleSelect = (event) => {
    setSelectedEvent(event);
    setNewDate(event.date);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/organizer-home');
  };

  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </header>
      <h2>Gérer le Calendrier des Épreuves</h2>
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
              <td>{event.venue}</td>
              <td>{event.availableSeats}</td>
              <td>
                <button onClick={() => handleRemove(event.id)}>Supprimer</button>
                <button onClick={() => handleSelect(event)}>Sélectionner</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && (
        <div className="form-container">
          <h3>Modifier la Date de l'Épreuve</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(selectedEvent.id, newDate);
          }}>
            <label>Nouvelle Date:</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
            <button type="submit">Valider</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
