import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AddDelegation from './AddDelegation';
import RemoveDelegation from './RemoveDelegation';
import AddParticipant from './AddParticipant';
import MaxParticipants from './MaxParticipants';
import ManageParticipants from './ManageParticipants';
import AddEvent from './AddEvent';
import MaxEvents from './MaxEvents';
import ManageEvents from './ManageEvents';
import AddController from './AddController';
import ManageControllers from './ManageControllers';
import Statistics from './Statistics';
import AddInfrastructure from './AddInfrastructure';
import ManageInfrastructure from './ManageInfrastructure';
import AddResult from './AddResult';
import ManageResults from './ManageResults';
import './OrganizerHome.css';
import './ParticipantHome.css';
import './ControllerHome.css';
import './SpectatorHome.css';

const Home = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const { logout, deleteAccount, sessionID, userRole, role, billets, updateBillet } = useAuth();

  const handleSectionChange = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page smoothly
  };

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

  const renderSection = () => {
    switch (activeSection) {
      case 'addDelegation':
        return <AddDelegation />;
      case 'removeDelegation':
        return <RemoveDelegation />;
      case 'addParticipant':
        return <AddParticipant />;
      case 'maxParticipants':
        return <MaxParticipants />;
      case 'manageParticipants':
        return <ManageParticipants />;
      case 'addEvent':
        return <AddEvent />;
      case 'maxEvents':
        return <MaxEvents />;
      case 'manageEvents':
        return <ManageEvents />;
      case 'addController':
        return <AddController />;
      case 'manageControllers':
        return <ManageControllers />;
      case 'statistics':
        return <Statistics />;
      case 'addInfrastructure':
        return <AddInfrastructure />;
      case 'manageInfrastructure':
        return <ManageInfrastructure />;
      case 'addResult':
        return <AddResult />;
      case 'manageResults':
        return <ManageResults />;
      default:
        return <p>Veuillez sélectionner une section à gérer.</p>;
    }
  }

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    console.log('sessionID:', localSessionID);
    if (!localSessionID) {
      navigate('/login');
    }
  }, [navigate]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      setMessage('Account deleted successfully');
    } catch (error) {
      console.error('Account deletion failed:', error.message);
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
      await updateBillet(billetId, 'Validé');
      console.log('Update ticket status to Validé for ticket:', billetId);
      setMessage('Billet validé avec succès');
    }
    catch (error) {
      console.error('Ticket validation failed:', error.message);
    }
  };

  const renderHome = (userRole) => {
    if (!sessionID || !userRole) {
      navigate('/login');
      return null;
    }
    switch (userRole) {
      case 'spectateur':
        return (
          <div className="spectator-home">
            <header className="spectator-home-header">
              <div className="center">
                <h1>MIAGique</h1>
              </div>
              <div className="right">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            </header>
            <div className="spectator-home-content">
              <h2>Welcome, Spectator</h2>
              {message && <p className="message">{message}</p>}
              <button type="button" className="secondary" onClick={() => navigate('/events-list')}>Consulter le programme des épreuves</button>
              <button type="button" className="secondary" onClick={() => navigate('/tickets')}>Voir billets</button>
              <button type="button" className="danger" onClick={handleDeleteAccount}>Supprimer compte</button>
            </div>
          </div>
        );
      case 'participant':
        return (
          <div className="participant-home">
            <header className="participant-home-header">
              <div className="center">
                <h1>MIAGique</h1>
              </div>
              <div className="right">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            </header>
            <div className="participant-home-content">
              <h2>Welcome, Participant</h2>
              <button className="secondary" onClick={() => navigate('/events-list')}>Consulter programme des épreuves</button>
              <button className="secondary" onClick={() => navigate('/results-and-rankings')}>Résultats et classement</button>
            </div>
          </div>
        );
      case 'organisateur':
        if (role === 'controleur') {
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
          return (
            <div className="organizer-home">
              <header className="organizer-home-header">
                <div className="left">
                  <h2 style={{color: 'white'}}>Welcome, Organizer</h2>
                </div>
                <div className="center">
                  <h1>MIAGique</h1>
                </div>
                <div className="right">
                  <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
              </header>
              <div className="dashboard">
                <aside className="sidebar">
                  <div className="section">
                    <h3>Gestion des délégations</h3>
                    <button onClick={() => handleSectionChange('addDelegation')}>Ajouter des délégations</button>
                    <button onClick={() => handleSectionChange('removeDelegation')}>Enlever des délégations</button>
                  </div>
                  <div className="section">
                    <h3>Gestion des participants</h3>
                    <button onClick={() => handleSectionChange('addParticipant')}>Créer participant</button>
                    <button onClick={() => handleSectionChange('maxParticipants')}>Nombre max de participants</button>
                    <button onClick={() => handleSectionChange('manageParticipants')}>Gérer participants</button>
                  </div>
                  <div className="section">
                    <h3>Gestion des Infrastructures d'accueil</h3>
                    <button onClick={() => handleSectionChange('addInfrastructure')}>Ajouter une infrastructure</button>
                    <button onClick={() => handleSectionChange('manageInfrastructure')}>Gérer les infrastructures</button>
                  </div>
                  <div className="section">
                    <h3>Gestion des épreuves</h3>
                    <button onClick={() => handleSectionChange('addEvent')}>Créer épreuve</button>
                    <button onClick={() => handleSectionChange('maxEvents')}>Modifier Nombre places disponibles des épreuves</button>
                    <button onClick={() => handleSectionChange('manageEvents')}>Gérer le calendrier des épreuves</button>
                  </div>
                  <div className="section">
                    <h3>Gérer les contrôleurs</h3>
                    <button onClick={() => handleSectionChange('addController')}>Créer un contrôleur</button>
                    <button onClick={() => handleSectionChange('manageControllers')}>Gérer contrôleurs</button>
                  </div>
                  <div className="section">
                    <h3>Résultats</h3>
                    <button onClick={() => handleSectionChange('addResult')}>Ajouter un résultat</button>
                    <button onClick={() => handleSectionChange('manageResults')}>Gérer les résultats</button>
                  </div>
                  <div className="section">
                    <h3>Statistiques</h3>
                    <button onClick={() => handleSectionChange('statistics')}>Statistiques</button>
                  </div>
                </aside>
                <main className="main-content">
                  {renderSection()}
                </main>
              </div>
            </div>
          );
        }
      default:
        throw new Error('Invalid user role');
    }
  };

  return renderHome(userRole);
};

export default Home;

