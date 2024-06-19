import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './EventsList.css'; // Ensure the CSS file is correctly linked

const EventsList = () => {
  const navigate = useNavigate();
  const { epreuves, getEpreuves, billets, createBillet, updateBillet, inscriptions, addInscription, removeInscription, maxParticipantsTable, updateNbParticipants, createResult, deleteResult, updateStatistics } = useAuth();
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const userRole = localStorage.getItem('userRole');
  getEpreuves();

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
  }, [navigate, getEpreuves]);

  const handleReserve = (eventId) => {
    if (!eventId) return;
    const existingBillet = billets?.find(billet => billet.epreuve.id === eventId);
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
  };

  const handlePay = (eventId) => {
    if (!eventId) return;
    const existingBillet = billets?.find(billet => billet.epreuve.id === eventId);
    if (existingBillet) {
      updateBillet(existingBillet.id, 'Payé');
      updateStatistics(existingBillet);
      setMessage('Paiement effectué avec succès');
      setMessageColor('green');
      setTimeout(() => {
        setMessage('Redirecting to homepage...');
        navigate('/');
      }, 3000);
    } else {
      setMessage('Aucun billet trouvé');
      setMessageColor('red');
    }
  };

  const handleInscription = (eventId) => {
    if (inscriptions.includes(eventId)) {
      setMessage('Déjà inscrit pour cet événement');
      setMessageColor('red');
      return;
    }

    const maxParticipants = maxParticipantsTable.find(item => item.epreuveId === eventId);
    if (maxParticipants && maxParticipants.maxParticipants >= maxParticipants.nbParticipants) {
      addInscription(eventId);
      setMessage('Inscription réalisée avec succès');
      setMessageColor('green');
      updateNbParticipants(eventId, maxParticipants.nbParticipants + 1);
      const eventDate = epreuves.find(epreuve => epreuve.id === eventId).date;
      createResult(eventId, eventDate, localStorage.getItem('userId'), 'En attente', 0);
    } else if (!maxParticipants) {
      setMessage('Nombre maximal de participants non défini pour cet événement');
      setMessageColor('red');
    } else if (maxParticipants.maxParticipants < maxParticipants.nbParticipants) {
      setMessage('Nombre maximal de participants atteint pour cet événement');
      setMessageColor('red');
    } else {
      setMessage('Erreur lors de l’inscription');
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
      <table>
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
                    {!billets || !billets.find(billet => billet.epreuve.id === epreuve.id) ? (
                      <>
                        <button className="action-button" style={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleReserve(epreuve.id)}>
                          Réserver
                        </button>
                        <button className="action-button" style={{ backgroundColor: 'blue' }} disabled>
                          Payer
                        </button>
                      </>
                    ) : (
                      billets.find(billet => billet.epreuve.id === epreuve.id && billet.etat === 'Réservé') ? (
                        <>
                          <button style={{ backgroundColor: '#b3ffb3' }} disabled>
                            Réservé
                          </button>
                          <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => handlePay(epreuve.id)}>
                            Payer
                          </button>
                        </>
                      ) : (
                        billets.find(billet => billet.epreuve.id === epreuve.id && billet.etat === 'Payé') && (
                          <p>
                            Payé
                          </p>
                        )
                      )
                    )}
                  </>
                )}
                {userRole === 'participant' && (
                  <>
                    {!inscriptions.includes(epreuve.id) ? (
                      <button className="action-button green" onClick={() => handleInscription(epreuve.id)}>
                        S'inscrire
                      </button>
                    ) : (
                      timeDifference(epreuve.id) > 10 ? (
                        <button className="action-button red" onClick={() => handleDesinscription(epreuve.id)}>
                          Désinscrire
                        </button>
                      ) : (
                        <button className="action-button disabled" disabled>
                          Désinscrire
                        </button>
                      )
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
