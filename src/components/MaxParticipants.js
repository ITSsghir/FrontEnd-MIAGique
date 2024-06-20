import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MaxParticipants = () => {
  const { epreuves , applyMaxParticipants, maxParticipantsTable } = useAuth();
  const [epreuveName, setEpreuveName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      const epreuve = epreuves.find((epreuve) => epreuve.nom === epreuveName);
      if (!epreuve) {
        setMessage(`Épreuve ${epreuveName} introuvable`);
        setMessageColor('red');
      }
      console.log('Applying max participants', epreuveName, maxParticipants);
      console.log('Epreuve', epreuve);
      await applyMaxParticipants(epreuve.id, maxParticipants);
      // Clean up form
      setEpreuveName('');
      setMaxParticipants(0);
      setMessage(`Nombre maximal de participants défini avec succès pour l’épreuve ${epreuveName}`);
      setMessageColor('green');
      console.log('Max participants applied successfully:', epreuveName, maxParticipants);
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
        <select value={epreuveName} onChange={(e) => {
          setEpreuveName(e.target.value);
          if (!e.target.value) {
            setMaxParticipants(0);
            return;
          }
          const maxParticipantsPerEpreuve = maxParticipantsTable.find(item => item.epreuveId === epreuves.find(epreuve => epreuve.nom === e.target.value).id);
          setMaxParticipants(maxParticipantsPerEpreuve ? maxParticipantsPerEpreuve.maxParticipants : 0);
        }}>
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
