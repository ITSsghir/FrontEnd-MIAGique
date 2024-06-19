import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import './Statistics.css';

function Statistics() {
  const { statistics } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const stats = localStorage.getItem('statistics');
    if (stats) {
      setStats(JSON.parse(stats));
    } else {
      setStats([]);
    }
  }, []);

  return (
    <div className="statistics-container">
      <header className="statistics-header">
        <button className="back-button" onClick={() => window.history.back()}>Retour</button>
        <h1 className="title">MIAGique</h1>
      </header>
      <h2>Statistics</h2>
      <div className="sales-history">
        <p>Historique de ventes:</p>
        <ul>
          {statistics == null || statistics.length === 0 ? (
            <li>Aucune vente</li>
          ) : (
            statistics.map((vente, index) => (
              <li key={index}>
                <p>{vente.epreuve.nom} - {vente.date} - {vente.prix}€</p>
              </li>
            ))
          )}
        </ul>
      </div>
      <p>Chiffre d'affaires: {statistics == null || statistics.length === 0 ? '0€' : statistics.reduce((acc, vente) => acc + vente.prix, 0) + '€'}</p>
    </div>
  );
}

export default Statistics;
