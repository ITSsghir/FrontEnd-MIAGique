import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResultsAndRankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    // Appel à l'API pour récupérer les résultats et classements
    axios.get('http://localhost:8080/api/rankings')
      .then(response => setRankings(response.data))
      .catch(error => console.error('Erreur lors de la récupération des classements:', error));
  }, []);

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
          {rankings.map(ranking => (
            <tr key={ranking.id}>
              <td>{ranking.id}</td>
              <td>{ranking.name}</td>
              <td>{ranking.goldMedals}</td>
              <td>{ranking.silverMedals}</td>
              <td>{ranking.bronzeMedals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsAndRankings;
