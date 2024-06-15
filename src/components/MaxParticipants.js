import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MaxParticipants = () => {
  const [maxParticipants, setMaxParticipants] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/participants/max', {
        maxParticipants
      });
      alert('Nombre maximal de participants défini avec succès');
    } catch (error) {
      console.error('Erreur lors de la définition du nombre maximal de participants', error);
      alert('Erreur lors de la définition du nombre maximal de participants');
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
      <h2>Définir le Nombre Maximal de Participants</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre Maximal de Participants:</label>
        <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default MaxParticipants;
