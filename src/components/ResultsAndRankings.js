import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './ResultsAndRankings.css'; // Ajoutez ceci pour inclure le fichier CSS

const ResultsAndRankings = () => {
  const navigate = useNavigate();
  const { user, delegation } = useAuth();

  useEffect(() => {
    const localSessionID = localStorage.getItem('sessionID');
    console.log('sessionID:', localSessionID);
    if (!localSessionID) {
      // Redirect unauthenticated users to login page
      navigate('/login');
    }
    console.log('User', user);
  }, [navigate]);

  return (
    <div className="results-container">
      <header className="results-header">
        <button className="back-button" onClick={() => navigate(-1)}>Retour</button>
        <h1 className="title">MIAGique</h1>
      </header>
      <h2>Résultats et Classements</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Nombre médailles d’or</th>
            <th>Nombre médailles d’argent</th>
            <th>Nombre médailles de bronze</th>
          </tr>
        </thead>
        <tbody>
          <tr key={delegation.id}>
            <td>{delegation.id}</td>
            <td>{delegation.nom}</td>
            <td>{delegation.nombreMedailleOr}</td>
            <td>{delegation.nombreMedailleArgent}</td>
            <td>{delegation.nombreMedailleBronze}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResultsAndRankings;
