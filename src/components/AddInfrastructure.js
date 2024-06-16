import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AddInfrastructure = () => {
  const { createInfrastructure } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const navigate = useNavigate();

  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInfrastructure(name, address, capacity);
      setMessage('Infrastructure ajoutée avec succès');
      setName('');
      setAddress('');
      setCapacity('');
      setMessageColor('green');
    } catch (error) {
      setMessage('Erreur lors de l’ajout de l’infrastructure');
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
      <h2>Ajouter une Infrastructure Sportive</h2>
        <p style={{ color: messageColor }}>{message}</p>
        {'\n'}
      <form onSubmit={handleSubmit}>
        <label>Nom:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Adresse:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <label>Capacité:</label>
        <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default AddInfrastructure;