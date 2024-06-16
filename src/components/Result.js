import React from 'react'
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Result() {
  const { results, getResults } = useAuth();
  getResults();

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  }

  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleLogin}>Login</button>
      </header>
      <h2>Résultats</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Epreuve</th>  
            <th>Date</th>
            <th>Participant</th>
            <th>Temps</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td>{result.id}</td>
              {/* Display the epreuve name if it exists, otherwise display 'N/A' */}
              <td>{result.epreuve ? result.epreuve.nom : 'N/A'}</td>
              <td>{result.date ? new Date(result.date).toLocaleDateString() : 'N/A'}</td>
              <td>{result.participant ? `${result.participant.prenom} ${result.participant.nom}` : 'N/A'}</td>
              <td>{result.temps}</td>
              <td>{result.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}