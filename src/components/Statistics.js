import React from 'react';
import { useAuth } from './AuthContext';
import './Statistics.css';

function Statistics() {
  const { statistics } = useAuth();

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
                le {vente.date} - {vente.prix}€ - Épreuve: {vente.epreuve.nom}
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
