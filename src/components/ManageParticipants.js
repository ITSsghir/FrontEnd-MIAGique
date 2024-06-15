import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipants = async () => {
      const result = await axios.get('http://localhost:8080/api/participants');
      setParticipants(result.data);
    };
    fetchParticipants();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/participants/${id}`);
      setParticipants(participants.filter(participant => participant.id !== id));
      alert('Participant supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du participant', error);
      alert('Erreur lors de la suppression du participant');
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
      <h2>Gérer les Participants</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Délégation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(participant => (
            <tr key={participant.id}>
              <td>{participant.id}</td>
              <td>{participant.firstName}</td>
              <td>{participant.lastName}</td>
              <td>{participant.email}</td>
              <td>{participant.delegation}</td>
              <td>
                <button onClick={() => handleRemove(participant.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageParticipants;
