import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MaxEvents = () => {
  const [maxEvents, setMaxEvents] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/events/max', {
        maxEvents
      });
      alert('Nombre maximal d\'épreuves défini avec succès');
    } catch (error) {
      console.error('Erreur lors de la définition du nombre maximal d\'épreuves', error);
      alert('Erreur lors de la définition du nombre maximal d\'épreuves');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/organizer-home');
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </header>
      <h2>Définir le Nombre Maximal d'Épreuves</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre Maximal d'Épreuves:</label>
        <input type="number" value={maxEvents} onChange={(e) => setMaxEvents(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default MaxEvents;
