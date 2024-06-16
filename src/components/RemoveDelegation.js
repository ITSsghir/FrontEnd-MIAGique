import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RemoveDelegation = () => {
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const { delegations, removeDelegation } = useAuth();
  const navigate = useNavigate();

  const handleRemove = async (id) => {
    try {
      await removeDelegation(id);
      setMessage('Délégation supprimée avec succès');
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de la suppression de la délégation', error);
      setMessage('Erreur lors de la suppression de la délégation');
      setMessageColor('red');
    }
  };

  const handleBack = () => {
    navigate('/organizer-home');
  };

  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Enlever une Délégation</h2>
      <p style={{ color: messageColor }}>{message}</p>
      {'\n'}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Médailles d’or</th>
            <th>Médailles d’argent</th>
            <th>Médailles de bronze</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {delegations.map(delegation => (
            <tr key={delegation.id}>
              <td>{delegation.id}</td>
              <td>{delegation.nom}</td>
              <td>{delegation.nombreMedailleOr}</td>
              <td>{delegation.nombreMedailleArgent}</td>
              <td>{delegation.nombreMedailleBronze}</td>
              <td>
                <button style={{backgroundColor: "red"}} onClick={() => handleRemove(delegation.id)}>Enlever</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RemoveDelegation;
