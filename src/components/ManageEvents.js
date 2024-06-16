import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageEvents = () => {
  const { epreuves, updateEpreuve, deleteEpreuve } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');


  const handleRemove = async (id) => {
   try {
     await deleteEpreuve(id);
     setMessage('Épreuve supprimée avec succès');
     setMessageColor('green');
   } catch (error) {
      console.error('Erreur lors de la suppression de l\'épreuve', error);
      setMessage('Erreur lors de la suppression de l\'épreuve');
      setMessageColor('red');
    }

  };

  const handleUpdate = async (id, newDate) => {
    try {
      const epreuve = epreuves.find(epreuve => epreuve.id === id);
      await updateEpreuve(id, epreuve.nom, newDate, epreuve.infrastructure, epreuve.nombrePlaces);
      setMessage('Date de l\'épreuve modifiée avec succès');
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la date de l\'épreuve', error);
      setMessage('Erreur lors de la mise à jour de la date de l\'épreuve');
      setMessageColor('red');
    }

  };

  const [newDate, setNewDate] = useState('');
  const handleBack = () => {
    navigate('/organizer-home');
  };

  const displayData = (date) => {
    const dateArray = date.split('T');
    const datePart = dateArray[0];
    const timeArray = dateArray[1].split(':');
    const timePart = timeArray[0] + ':' + timeArray[1];
    return datePart + ' - ' + timePart;
  };

  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Gérer le Calendrier des Épreuves</h2>
      <p style={{ color: messageColor }}>{message}</p>
      {'\n'}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nom de l'épreuve</th>
            <th>Date</th>
            <th>Infrastructure d’accueil</th>
            <th>Nombre de places mises en vente</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {epreuves.map(epreuve => (
            <tr key={epreuve.id}>
              {/* implement checkbox for each row, and when i select if it changes the infos in the row to input fields */}
              <td><input type="checkbox" /></td>
              <td>{epreuve.id}</td>
              <td>{epreuve.nom}</td>
              <td>{displayData(epreuve.date)}</td>
              <td>{epreuve.infrastructure.nom}</td>
              <td>{epreuve.nombrePlaces}</td>
              <td>
                <input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                <button onClick={() => handleUpdate(epreuve.id, newDate)}>Modifier la date</button>
                <button style={{ backgroundColor: "red" }} onClick={() => handleRemove(epreuve.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEvents;
