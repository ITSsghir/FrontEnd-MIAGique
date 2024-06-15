import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDelegation = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [goldMedals, setGoldMedals] = useState('');
  const [silverMedals, setSilverMedals] = useState('');
  const [bronzeMedals, setBronzeMedals] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/delegations', {
        id,
        name,
        goldMedals,
        silverMedals,
        bronzeMedals
      });
      alert('Délégation ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la délégation', error);
      alert('Erreur lors de l\'ajout de la délégation');
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
      <h2>Ajouter une Délégation</h2>
      <form onSubmit={handleSubmit}>
        <label>ID:</label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        <label>Nom:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Médailles d’or:</label>
        <input type="number" value={goldMedals} onChange={(e) => setGoldMedals(e.target.value)} required />
        <label>Médailles d’argent:</label>
        <input type="number" value={silverMedals} onChange={(e) => setSilverMedals(e.target.value)} required />
        <label>Médailles de bronze:</label>
        <input type="number" value={bronzeMedals} onChange={(e) => setBronzeMedals(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default AddDelegation;
