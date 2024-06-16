import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageParticipants = () => {
  
  const { participants, deleteParticipant, getParticipants, updateParticipant, delegations } = useAuth();
  const navigate = useNavigate();
  getParticipants();

  const [editModeParticipantId, setEditModeParticipantId] = useState(null); // Track participant in edit mode
  const [participant, setParticipant] = useState({
    id: '',
    prenom: '',
    nom: '',
    email: '',
    delegationId: ''
  }); // State to manage participant data being edited

  const [newParticipant, setNewParticipant] = useState({
    id: '',
    prenom: '',
    nom: '',
    email: '',
    delegationId: ''
  }); // State to manage new changes before update

  const [delegationName, setDelegationName] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');

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

  const handleUpdate = async (id) => {
    try {
      const selectedDelegation = delegations.find(delegation => delegation.nom === delegationName);
      await updateParticipant(id, newParticipant.prenom, newParticipant.nom, newParticipant.email, selectedDelegation.id);
      setMessage('Participant modifié avec succès');
      setMessageColor('green');
      setEditModeParticipantId(null); // Exit edit mode
    } catch (error) {
      console.error('Erreur lors de la modification du participant', error);
      setMessage('Erreur lors de la modification du participant');
      setMessageColor('red');
    }
  };

  const toggleEditMode = (id) => {
    const selectedParticipant = participants.find(participant => participant.id === id);
    setParticipant(selectedParticipant); // Set the participant being edited
    setNewParticipant(selectedParticipant); // Set the newParticipant with current participant data
    setDelegationName(selectedParticipant.delegation.nom); // Set the current delegation name
    setEditModeParticipantId(id === editModeParticipantId ? null : id); // Toggle edit mode
  };

  const isEditMode = (participantId) => {
    return editModeParticipantId === participantId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="table-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Gérer les Participants</h2>
      <p style={{ color: messageColor }}>{message}</p>
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
          {participants.map(participant => (
            <tr key={participant.id}>
              <td>{participant.id}</td>
              <td>
                {isEditMode(participant.id) ? (
                  <input
                    type="text"
                    name="prenom"
                    value={newParticipant.prenom}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  participant.prenom
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <input
                    type="text"
                    name="nom"
                    value={newParticipant.nom}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  participant.nom
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <input
                    type="email"
                    name="email"
                    value={newParticipant.email}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  participant.email
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <select
                    value={delegationName}
                    onChange={(e) => setDelegationName(e.target.value)}
                    required
                  >
                    {delegations.map(delegation => (
                      <option key={delegation.id} value={delegation.nom}>{delegation.nom}</option>
                    ))}
                  </select>
                ) : (
                  participant.delegation.nom
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <button onClick={() => handleUpdate(participant.id)}>Valider</button>
                ) : (
                  <button onClick={() => toggleEditMode(participant.id)}>Modifier</button>
                )}
                <button style={{ backgroundColor: "red" }} onClick={() => handleRemove(participant.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageParticipants;
