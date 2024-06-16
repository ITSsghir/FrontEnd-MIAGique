import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { logout, deleteAccount, sessionID, userRole, role, billets, updateBillet } = useAuth();

  const renderMessage = (billet) => {
    if (billet.etat === 'Validé') {
      return 'Billet déjà validé';
    } else if (billet.etat === 'Annulé') {
      return 'Billet annulé, impossible de valider';
    } else if (billet.etat === 'Réservé') {
      return 'Billet réservé, veuillez payer pour pouvoir valider';
    } else {
      return 'Billet non trouvé';
    }
  }

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

  const handleValidateTicket = async (billetId) => {
    if (!billetId) {
      console.error('Ticket ID is required');
      setMessage('Billet non trouvé');
      return;
    }
    // Check the ticket status
    const ticket = billets.find(billet => billet.id === billetId);
    if (!ticket) {
      console.error('Ticket not found:', billetId);
      setMessage(renderMessage(ticket));
      return;
    }
    if (ticket.etat === 'Validé') {
      console.log('Ticket already validated:', billetId);
      setMessage(renderMessage(ticket));
      return;
    } else if (ticket.etat === 'Annulé') {
      console.log('Ticket is cancelled:', billetId);
      setMessage(renderMessage(ticket));
      return;
    } else if (ticket.etat === 'Réservé') {
      console.log('Ticket is reserved:', billetId);
      setMessage(renderMessage(ticket));
      return;
    }

    try {
      // Update the ticket status to 'Payé'
      await updateBillet(billetId, 'Validé');
      console.log('Update ticket status to Validé for ticket:', billetId);
      setMessage('Billet validé avec succès');
    }
    catch (error) {
      console.error('Ticket validation failed:', error.message);
      // Handle ticket validation error
    }
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
          <div className="participant-home">
            <header className="participant-home-header">
              <div className="left">
                <h2>Welcome, Participant</h2>
              </div>
              <div className="center">
                <h1>MIAGique</h1>
              </div>
              <div className="right">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            </header>
            <main className="participant-home-main">
              <button className="secondary" onClick={() => navigate('/events-list')}>Consulter programme des épreuves</button>
              <button className="secondary" onClick={() => navigate('/results-and-rankings')}>Résultats et classement</button>
            </main>
          </div>
        );
      case 'organisateur':
        if (role === 'organisateur') {
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
        } else if (role === 'controleur') {
          return (
            <div className="controller-home">
            <header className="controller-home-header">
              <div className="left">
                <h2>Welcome, Controller</h2>
              </div>
              <div className="center">
                <h1>MIAGique</h1>
              </div>
              <div className="right">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            </header>
            <main className="controller-home-main">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Epreuve</th>
                    <th>Spectateur</th>
                    <th>Prix</th>
                    <th>État</th>
                    <th>Actions</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {billets.map(billet => (
                    <tr key={billet.id}>
                      <td>{billet.id}</td>
                      <td>{billet.epreuve.nom}</td>
                      <td>{billet.spectateur.prenom} {billet.spectateur.nom}</td>
                      <td>{billet.prix}</td>
                      <td>{billet.etat}</td>
                      
                      {/* Display Validate button only if ticket status is 'Payé' */}
                      <td>
                      {billet.etat === 'Payé' && (
                        <button onClick={() => handleValidateTicket(billet.id)}>Valider</button>
                      )}
                      </td>
                      <td>{renderMessage(billet)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </main>
          </div>
          );
        } else {
          throw new Error('Invalid organizer role');
        }
      default:
        // Unreachable code, throw an error if userRole is not one of the above
        throw new Error('Invalid user role');
    }
  };

  return renderHome(userRole);
};

export default Home;