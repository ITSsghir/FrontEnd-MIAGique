import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './EventsList.css'; // Ajoutez ceci pour inclure le fichier CSS

const EventsList = () => {
  const navigate = useNavigate();
  const { epreuves, getEpreuves, billets, createBillet, updateBillet, inscriptions, addInscription, removeInscription, maxParticipantsTable, updateNbParticipants, createResult, deleteResult } = useAuth();
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const userRole = localStorage.getItem('userRole');

  const timeDifference = (eventId) => {
    const currentTime = new Date().getTime();
    const event = epreuves.find(epreuve => epreuve.id === eventId);
    const eventTime = new Date(event.date).getTime();
    return (eventTime - currentTime) / (1000 * 3600 * 24);
  };

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    if (!localSessionID) {
      navigate('/login');
    }
    getEpreuves();
  }, [navigate]);

  const handleReserve = (eventId) => {
    if (!eventId) return;
    if (!billets) {
      createBillet(eventId);
      setMessage('Ticket créé et réservé avec succès');
      setMessageColor('green');
    } else {
      const existingBillet = billets.find(billet => billet.epreuve.id === eventId);
      if (existingBillet) {
        if (existingBillet.etat === 'Réservé' || existingBillet.etat === 'Payé') {
          setMessage('Ticket déjà réservé pour cet événement');
          setMessageColor('red');
        } else {
          updateBillet(existingBillet.id, 'Réservé');
          setMessage('Ticket réservé avec succès');
          setMessageColor('green');
        }
      } else {
        createBillet(eventId);
        setMessage('Ticket créé et réservé avec succès');
        setMessageColor('green');
      }
    }
  };

  const handlePay = (eventId) => {
    if (!eventId) return;
    if (!billets) {
      setMessage('Aucun billet trouvé');
      setMessageColor('red');
      return;
    }
    const existingBillet = billets.find(billet => billet.epreuve.id === eventId);
    updateBillet(existingBillet.id, 'Payé');
    setMessage('Paiement effectué avec succès');
    setMessageColor('green');
    setTimeout(() => setMessage('Redirecting to homepage...'), 3000);
    setTimeout(() => navigate('/'), 5000);
  };

  const handleInscription = (eventId) => {
    if (inscriptions.includes(eventId)) {
      setMessage('Déjà inscrit pour cet événement');
      setMessageColor('red');
      return;
    }
    const maxParticipants = maxParticipantsTable.find(item => item.epreuveId === eventId);
    if (maxParticipants && maxParticipants.maxParticipants > maxParticipants.nbParticipants) {
      addInscription(eventId);
      setMessage('Inscription réalisée avec succès');
      setMessageColor('green');
      updateNbParticipants(eventId, maxParticipantsTable.nbParticipants + 1);
      const eventDate = epreuves.find(epreuve => epreuve.id === eventId).date;
      createResult(eventId, eventDate, localStorage.getItem('userId'), 'En attente', 0);
    } else {
      setMessage('Nombre maximal de participants atteint pour cet événement');
      setMessageColor('red');
    }
  };

  const handleDesinscription = (eventId) => {
    removeInscription(eventId);
    setMessage('Désinscription réalisée avec succès');
    setMessageColor('green');
    updateNbParticipants(eventId, maxParticipantsTable.nbParticipants - 1);
    deleteResult(eventId, localStorage.getItem('userId'));
  };

  return (
    <div className="events-container">
      <header className="events-header">
        <button className="back-button" onClick={() => navigate(-1)}>Retour</button>
        <h1 className="title">MIAGique</h1>
      </header>
      <h2>Programme des épreuves</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <table className="events-table">
        <thead>
          <tr>
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
              <td>{epreuve.id}</td>
              <td>{epreuve.nom}</td>
              <td>{epreuve.date}</td>
              <td>{epreuve.infrastructure.nom}</td>
              <td>{epreuve.nombrePlaces}</td>
              <td>
                {userRole === 'spectateur' && (
                  <>
                    <button className="action-button" onClick={() => handleReserve(epreuve.id)}>Réserver</button>
                    <button className="action-button" onClick={() => handlePay(epreuve.id)}>Payer</button>
                  </>
                )}
                {userRole === 'participant' && (
                  <>
                    {!inscriptions.includes(epreuve.id) && (
                      <button className="action-button green" onClick={() => handleInscription(epreuve.id)}>
                        S'inscrire
                      </button>
                    )}
                    {inscriptions.includes(epreuve.id) && (timeDifference(epreuve.id) > 10) && (
                      <button className="action-button red" onClick={() => handleDesinscription(epreuve.id)}>
                        Désinscrire
                      </button>
                    )}
                    {inscriptions.includes(epreuve.id) && (timeDifference(epreuve.id) <= 10) && (
                      <button className="action-button disabled" disabled>
                        Désinscrire
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsList;
