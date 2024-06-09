import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { logout, deleteAccount, sessionID, userRole } = useAuth();

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    console.log('sessionID:', localSessionID);
    if (!localSessionID) {
      // Redirect unauthenticated users to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      setMessage('Account deleted successfully');
    } catch (error) {
      console.error('Account deletion failed:', error.message);
      // Handle account deletion error
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderHome = (userRole) => {
    if (!sessionID || !userRole) {
      navigate('/login');
      return null; // Return null to prevent rendering if navigating
    }
    switch (userRole) {
      case 'spectateur':
        return (
          <div>
            <h2>Welcome, Spectator ${}</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="button" className="secondary" onClick={() => navigate('/events-list')}>Consulter le programme des épreuves</button>
            <button type="button" className="secondary" onClick={() => navigate('/tickets')}>Voir billets</button>
            <button type="button" className="danger" onClick={handleDeleteAccount}>Supprimer compte</button>
            <button type="button" className="danger" onClick={handleLogout}>Logout</button>
          </div>
        );
      case 'participant':
        return (
          <div>
            <h2>Welcome, Participant</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="button" className="secondary" onClick={() => navigate('/events-list')}>Consulter le programme des épreuves</button>
            <button type="button" className="secondary" onClick={() => navigate('/payment')}>Payer</button>
            <button type="button" className="danger" onClick={handleDeleteAccount}>Supprimer compte</button>
            <button type="button" className="danger" onClick={handleLogout}>Logout</button>
          </div>
        );
      case 'organisateur':
        return (
          <div>
            <h2>Welcome, Organizer</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="button" className="secondary" onClick={() => navigate('/events-list')}>Consulter le programme des épreuves</button>
            <button type="button" className="secondary" onClick={() => navigate('/tickets')}>Voir billets</button>
            <button type="button" className="danger" onClick={handleDeleteAccount}>Supprimer compte</button>
            <button type="button" className="danger" onClick={handleLogout}>Logout</button>
          </div>
        );
      default:
        // Unreachable code, throw an error if userRole is not one of the above
        throw new Error('Invalid user role');
    }
  };

  return renderHome(userRole);
};

export default Home;