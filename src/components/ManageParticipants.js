import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageParticipants = () => {
  const { participants, deleteParticipant } = useAuth();
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleRemove = async (id) => {
    try {
      await deleteParticipant(id);
      setMessage('Participant supprimé avec succès');
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de la suppression du participant', error);
      setMessage('Erreur lors de la suppression du participant');
      setMessageColor('red');
    }
  };
  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    console.log('Participants', participants);
    for (let participant of participants) {
      console.log('Participant', participant);
      console.log("delegation participant", participant.delegation);
    }
  }
  , [participants]);


  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Gérer les Participants</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Delegation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Display participants by accessing the participants array */}
          {participants.map(participant => (
            <tr key={participant.id}>
              <td>{participant.id}</td>
              <td>{participant.prenom}</td>
              <td>{participant.nom}</td>
              <td>{participant.email}</td>
              <td>{participant.delegation ? participant.delegation.id : 'N/A'}</td>
              <td>
                <button style={{backgroundColor: "red"}} onClick={() => handleRemove(participant.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageParticipants;
