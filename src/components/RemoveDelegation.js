import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RemoveDelegation = () => {
  const [delegations, setDelegations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDelegations = async () => {
      const result = await axios.get('http://localhost:8080/api/delegations');
      setDelegations(result.data);
    };
    fetchDelegations();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/delegations/${id}`);
      setDelegations(delegations.filter(delegation => delegation.id !== id));
      alert('Délégation enlevée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la délégation', error);
      alert('Erreur lors de la suppression de la délégation');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/organizer-home');
  };

  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </header>
      <h2>Enlever une Délégation</h2>
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
              <td>{delegation.name}</td>
              <td>{delegation.goldMedals}</td>
              <td>{delegation.silverMedals}</td>
              <td>{delegation.bronzeMedals}</td>
              <td>
                <button onClick={() => handleRemove(delegation.id)}>Enlever</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RemoveDelegation;
