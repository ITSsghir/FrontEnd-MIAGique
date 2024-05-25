import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SpectatorHome = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleDeleteAccount = async () => {
    // Simuler un appel API pour supprimer le compte
    console.log('API call to delete account');

    // Simuler un délai pour l'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Afficher le message de confirmation
    setMessage('Votre compte a été supprimé');

    // Optionnel : Rediriger vers la page de connexion après un délai
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="container">
      <h2>Welcome, Spectator</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button className="secondary" onClick={() => navigate('/events-list')}>Consulter le programme des épreuves</button>
      <button className="secondary" onClick={() => navigate('/tickets')}>Voir billets</button>
      <button className="danger" onClick={handleDeleteAccount}>Supprimer compte</button>
    </div>
  );
};

export default SpectatorHome;
