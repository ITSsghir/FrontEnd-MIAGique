import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MaxParticipants = () => {
  // MaxParticipants is a number
  const { epreuves , applyMaxParticipants } = useAuth();
  const [epreuveName, setEpreuveName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const epreuve = epreuves.find((epreuve) => epreuve.nom === epreuveName);
      console.log('Applying max participants', epreuveName, maxParticipants);
      console.log('Epreuve', epreuve);
      await applyMaxParticipants(epreuve.id, maxParticipants);
      // Clean up form
      setEpreuveName('');
      setMaxParticipants('');
      setMessage("Nombre maximal de participants défini avec succès pour l’épreuve " + epreuveName);
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de la définition du nombre maximal de participants', error);
      setMessage("Erreur lors de la définition du nombre maximal de participants pour l’épreuve " + epreuveName);
      setMessageColor('red');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Définir le Nombre Maximal de Participants</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <form onSubmit={handleSubmit}>
        <label>Épreuve:</label>
        { /* Create a dropdown list of epreuves */}
        <select value={epreuveName} onChange={(e) => setEpreuveName(e.target.value)} required>
          <option value="">Choisissez une épreuve</option>
          {epreuves.map(epreuve => (
            <option key={epreuve.id} value={epreuve.nom}>{epreuve.nom}</option>
          ))}
        </select>
        <label>Nombre Maximal de Participants:</label>
        <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default MaxParticipants;
