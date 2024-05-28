import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SpectatorHome = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const { logout, sessionID } = useAuth();

  useEffect(() => {
    if (!sessionID) {
      navigate('/login');
    }
  }, [sessionID, navigate]);

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }
  return (
    <div className="container">
      <h2>Welcome, Spectator</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button className="secondary" onClick={() => navigate('/events-list')}>Consulter le programme des épreuves</button>
      <button className="secondary" onClick={() => navigate('/tickets')}>Voir billets</button>
      <button className="danger" onClick={handleDeleteAccount}>Supprimer compte</button>
      <button className="danger" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SpectatorHome;
