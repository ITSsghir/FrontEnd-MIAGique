import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrganizerHome.css';

const OrganizerHome = () => {
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  const renderButtons = () => {
    switch (activeSection) {
      case 'delegation':
        return (
          <>
            <button className="secondary">Ajouter des délégations</button>
            <button className="danger">Enlever délégations</button>
          </>
        );
      case 'participants':
        return (
          <>
            <button className="secondary">Créer participant</button>
            <button className="secondary">Nombre max de participants</button>
            <button className="secondary">Gérer participants</button>
          </>
        );
      case 'events':
        return (
          <>
            <button className="secondary">Créer épreuve</button>
            <button className="secondary">Nombre disponible des épreuves</button>
            <button className="secondary">Gérer le calendrier des épreuves</button>
          </>
        );
      case 'controllers':
        return (
          <>
            <button className="secondary">Créer un contrôleur</button>
            <button className="secondary">Gérer contrôleurs</button>
          </>
        );
      case 'statistics':
        return (
          <>
            <button className="secondary">Statistiques des ventes</button>
            <button className="secondary">Nombre de places disponibles</button>
            <button className="secondary">Chiffre d’affaires</button>
          </>
        );
      default:
        return <p>Veuillez sélectionner une section.</p>;
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
          <button onClick={() => setActiveSection('delegation')}>Gestion des délégations</button>
          <button onClick={() => setActiveSection('participants')}>Gestion des participants</button>
          <button onClick={() => setActiveSection('events')}>Gestion des épreuves</button>
          <button onClick={() => setActiveSection('controllers')}>Gérer les contrôleurs</button>
          <button onClick={() => setActiveSection('statistics')}>Statistiques</button>
        </aside>
        <main className="main-content">
          {renderButtons()}
        </main>
      </div>
    </div>
  );
};

export default OrganizerHome;
