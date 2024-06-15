import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/events', {
        id,
        name,
        date,
        venue,
        availableSeats
      });
      alert('Épreuve ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'épreuve', error);
      alert('Erreur lors de l\'ajout de l\'épreuve');
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
      <h2>Ajouter une Épreuve</h2>
      <form onSubmit={handleSubmit}>
        <label>ID:</label>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        <label>Nom de l'épreuve:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Infrastructure d’accueil:</label>
        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        <label>Nombre de places mises en vente:</label>
        <input type="number" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default AddEvent;
