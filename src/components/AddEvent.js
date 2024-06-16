import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AddEvent = () => {
  const [message, setMessage] = useState(''); // Add this line
  const [messageColor, setMessageColor] = useState('green'); // Add this line
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(''); // Add this line
  const [timeZone, setTimeZone] = useState(''); // Add this line
  const [infrastructureName, setInfrastructureName] = useState(''); // Add this line
  const [availableSeats, setAvailableSeats] = useState('');
  const navigate = useNavigate();

  const { createEpreuve, infrastructures } = useAuth();
  const infrastructure = infrastructures.find(infrastructure => infrastructure.nom === infrastructureName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Adding event', name, date, time, infrastructure, availableSeats);
    const timeZoneOffset = new Date().getTimezoneOffset() * 60000;

    // Combine date and time into a single string and convert to UTC+2 (Paris time zone)
    const dateTime = new Date(`${date}T${time}`).getTime() - timeZoneOffset;
    try {
      const infrastructureCapacity = infrastructure.capacite;
      if (availableSeats > infrastructureCapacity) {
        setMessage('Le nombre de places disponibles ne peut pas dépasser la capacité de l’infrastructure'); // Add this line
        setMessageColor('red'); // Add this line
        return;
      }

      await createEpreuve(name, dateTime, infrastructure, availableSeats);
      // Clean up form
      setMessage('Épreuve ajoutée avec succès'); // Add this line
      setMessageColor('green'); // Add this line
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’épreuve', error);
      setMessage('Erreur lors de l’ajout de l’épreuve'); // Add this line
      setMessageColor('red'); // Add this line
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
      <h2>Ajouter une Épreuve</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <form>
        <label>Nom de l'épreuve:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Heure</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <label>Fuseau horaire</label>
        {/* Add a dropdown list of time zones */}
        <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} required>
          <option value="">Choisissez un fuseau horaire</option>
          <option value="Europe/Paris">Europe/Paris</option>
        </select>
        <label>Infrastructure:</label>
        {/* Add a dropdown list of infrastructures */}
        <select value={infrastructureName} onChange={(e) => setInfrastructureName(e.target.value)} required>
          <option value="">Choisissez une infrastructure</option>
          {infrastructures.map(infrastructure => (
            <option key={infrastructure.id} value={infrastructure.nom}>{infrastructure.nom}</option>
          ))}
        </select>
        <label>Nombre de places mises en vente:</label>
        <input type="number" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} required />
        <button type="submit" onClick={handleSubmit}>Ajouter</button>
      </form>
    </div>
  );
};

export default AddEvent;
