import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganizerHome.css';
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

const OrganizerHome = () => {
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

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
      default:
        return <p>Veuillez sélectionner une section à gérer.</p>;
    }
  };

  return (
    <div className="organizer-home">
      <header className="organizer-home-header">
        <div className="left">
          <h2>Welcome, Organizer</h2>
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
            <button onClick={() => setActiveSection('addDelegation')}>Ajouter des délégations</button>
            <button onClick={() => setActiveSection('removeDelegation')}>Enlever des délégations</button>
          </div>
          <div className="section">
            <h3>Gestion des participants</h3>
            <button onClick={() => setActiveSection('addParticipant')}>Créer participant</button>
            <button onClick={() => setActiveSection('maxParticipants')}>Nombre max de participants</button>
            <button onClick={() => setActiveSection('manageParticipants')}>Gérer participants</button>
          </div>
          <div className="section">
            <h3>Gestion des épreuves</h3>
            <button onClick={() => setActiveSection('addEvent')}>Créer épreuve</button>
            <button onClick={() => setActiveSection('maxEvents')}>Nombre disponible des épreuves</button>
            <button onClick={() => setActiveSection('manageEvents')}>Gérer le calendrier des épreuves</button>
          </div>
          <div className="section">
            <h3>Gérer les contrôleurs</h3>
            <button onClick={() => setActiveSection('addController')}>Créer un contrôleur</button>
            <button onClick={() => setActiveSection('manageControllers')}>Gérer contrôleurs</button>
          </div>
          <div className="section">
            <h3>Statistiques</h3>
            <button onClick={() => setActiveSection('statistics')}>Statistiques</button>
          </div>
        </aside>
        <main className="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default OrganizerHome;
