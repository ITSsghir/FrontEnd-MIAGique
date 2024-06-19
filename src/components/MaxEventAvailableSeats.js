import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MaxEvents = () => {
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const { epreuves, updateEpreuve, getEpreuves } = useAuth();
  const [epreuveName, setEpreuveName] = useState('');
  const [epreuve, setEpreuve] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating max available seats', epreuve, epreuve.id, availableSeats);
      const infrastructureCapacity = epreuve.infrastructure.capacite;
      if (availableSeats > infrastructureCapacity) {
        setMessage('Le nombre maximal de places mis en vente ne peut pas dépasser la capacité de l\'infrastructure');
        setMessageColor('red');
        return;
      }

      await updateEpreuve(epreuve.id, epreuve.nom, epreuve.date, epreuve.infrastructure, availableSeats);

      setMessage('Nombre maximal de places mis à jour avec succès');
      setMessageColor('green');
    }
    catch (error) {
      console.error('Erreur lors de la définition du nombre maximal de places', error);
      setMessage('Erreur lors de la définition du nombre maximal de places: ' + error.message);
      setMessageColor('red');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (epreuve) {
      setAvailableSeats(epreuve.nombrePlaces);
    }
  }, [epreuve]);

  useEffect(() => {
    getEpreuves();
  }, [getEpreuves]);

  return (
    <div className="form-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Définir le Nombre Maximal de places</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <form onSubmit={handleSubmit}>
        <label>Nombre Maximal d'Épreuves:</label>
        {/*Dropdown list of epreuves and when i select an epreuve, i want to display the number of availableSeats (availableSeats is a number) */}
        <select value={epreuveName} onChange={(e) => {
          setEpreuveName(e.target.value);
          if (!e.target.value) {
            setAvailableSeats(0);
            return;
          }
          const epreuve = epreuves.find((epreuve) => epreuve.nom === e.target.value);
          setEpreuve(epreuve);
          setAvailableSeats(epreuve.nombrePlaces);
        }} required>
          <option value="">Choisissez une épreuve</option>
          {epreuves.map(epreuve => (
            <option key={epreuve.id} value={epreuve.nom}>{epreuve.nom}</option>
          ))}
        </select>
        <label>Nombre de places disponibles à la vente:</label>
        <input type="number" value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} required />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default MaxEvents;
