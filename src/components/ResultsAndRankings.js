import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <div className="container">
      <h2>Résultats et Classements</h2>
      <table>
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
          {/* Show the delegation */}
          <tr key={delegation.id}>
            <td>{delegation.id}</td>
            <td>{delegation.nom}</td>
            <td>{delegation.nombreMedailleArgent}</td>
            <td>{delegation.nombreMedailleArgent}</td>
            <td>{delegation.nombreMedailleBronze}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResultsAndRankings;
