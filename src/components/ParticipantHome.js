import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ParticipantHome.css';

const ParticipantHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

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
        <button className="secondary" onClick={() => navigate('/events-list-participant')}>Consulter programme des épreuves</button>
        <button className="secondary" onClick={() => navigate('/results-and-rankings')}>Résultats et classement</button>
      </main>
    </div>
  );
};

export default ParticipantHome;
