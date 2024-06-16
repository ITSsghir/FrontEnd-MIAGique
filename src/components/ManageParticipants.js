import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageParticipants = () => {
  const { participants, deleteParticipant, getParticipants, updateParticipant, delegations } = useAuth();
  const [participant, setParticipant] = useState({});
  const [delegationName, setDelegationName] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [editModeParticipantId, setEditModeParticipantId] = useState(null); // Track participant in edit mode

  useEffect(() => {
    getParticipants();
  }, [getParticipants]);

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
      const delegation = delegations.find(delegation => delegation.nom === delegationName);
      await updateParticipant(id, participant.prenom, participant.nom, participant.email, delegation.id);
      setMessage('Participant modifié avec succès');
      setMessageColor('green');
      setEditModeParticipantId(null); // Exit edit mode
    } catch (error) {
      console.error('Erreur lors de la modification du participant', error);
      setMessage('Erreur lors de la modification du participant');
      setMessageColor('red');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const toggleEditMode = (id) => {
    setEditModeParticipantId(id === editModeParticipantId ? null : id); // Toggle edit mode
  };

  const isEditMode = (participantId) => {
    return editModeParticipantId === participantId;
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
                  <input type="text" value={participant.prenom} onChange={(e) => setParticipant({ ...participant, prenom: e.target.value })} />
                ) : (
                  participant.prenom
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <input type="text" value={participant.nom} onChange={(e) => setParticipant({ ...participant, nom: e.target.value })} />
                ) : (
                  participant.nom
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <input type="email" value={participant.email} onChange={(e) => setParticipant({ ...participant, email: e.target.value })} />
                ) : (
                  participant.email
                )}
              </td>
              <td>
                {isEditMode(participant.id) ? (
                  <select value={delegationName} onChange={(e) => setDelegationName(e.target.value)} required>
                    <option value="">{participant.delegation.nom}</option>
                    {delegations.map(delegation => (
                      delegation.nom !== participant.delegation.nom && (
                        <option key={delegation.id} value={delegation.nom}>{delegation.nom}</option>
                      )
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
