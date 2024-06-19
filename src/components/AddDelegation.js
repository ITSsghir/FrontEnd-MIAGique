import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AddDelegation = () => {
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [goldMedals, setGoldMedals] = useState('');
  const [silverMedals, setSilverMedals] = useState('');
  const [bronzeMedals, setBronzeMedals] = useState('');

  const { createDelegation, logout } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDelegation(name, goldMedals, silverMedals, bronzeMedals);
      setMessage('Délégation ajoutée avec succès');
      // Clean up form
      setName('');
      setGoldMedals('');
      setSilverMedals('');
      setBronzeMedals('');
      setMessageColor('green');
    } catch (error) {
      setMessage('Erreur lors de l’ajout de la délégation');
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
      <h2>Ajouter une Délégation</h2>
      {'\n'}
      {/* Display message, if succes, color is green, else color is red 
       */}
      <p style={{ color: messageColor }}>{message}</p>
      {'\n'}
      <form>
        <label>Nom:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Médailles d’or:</label>
        <input type="number" value={goldMedals} onChange={(e) => setGoldMedals(e.target.value)} required />
        <label>Médailles d’argent:</label>
        <input type="number" value={silverMedals} onChange={(e) => setSilverMedals(e.target.value)} required />
        <label>Médailles de bronze:</label>
        <input type="number" value={bronzeMedals} onChange={(e) => setBronzeMedals(e.target.value)} required />
        <button type="submit" onClick={handleSubmit}>Ajouter</button>
      </form>
    </div>
  );
};

export default AddDelegation;
