import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AddResult = () => {
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');
  const { epreuves, delegations, getDelegations, participants, getEpreuves, getParticipants, createResult, updateDelegation } = useAuth();
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState('');
  const [epreuveId, setEpreuveId] = useState('');
  const [temps, setTemps] = useState('');
  const [position, setPosition] = useState('');
  getEpreuves();
  getParticipants();

  const updateDelegationInfo = async (participantId, position) => {
    try {
      getParticipants();
      const participant = participants.find(participant => participant.id === participantId);
      getDelegations();
      const delegation = delegations.find(delegation => delegation.id === participant.delegation.id);
      console.log('Updating delegation info', delegation, position);
      if (position === 1) {
        const goldMedals = delegation.nombreMedailleOr + 1;
        await updateDelegation(delegation.id, delegation.nom, goldMedals, delegation.nombreMedailleArgent, delegation.nombreMedailleBronze);
      } else if (position === 2) {
        const silverMedals = delegation.nombreMedailleArgent + 1;
        await updateDelegation(delegation.id, delegation.nom, delegation.nombreMedailleOr, silverMedals, delegation.nombreMedailleBronze);
      } else if (position === 3) {
        const bronzeMedals = delegation.nombreMedailleBronze + 1;
        await updateDelegation(delegation.id, delegation.nom, delegation.nombreMedailleOr, delegation.nombreMedailleArgent, bronzeMedals);
      } else {
        console.log('Position outside of top 3, no medal awarded');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la délégation', error);
      throw new Error('Erreur lors de la mise à jour de la délégation: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding result', participantId, epreuveId, temps, position);
      // Update delegation info, if success then create result, else show error
      //await updateDelegationInfo(participantId, position);

      await createResult(epreuveId, participantId, temps, position);


      // Clean up form
      setMessage('Résultat ajouté avec succès');
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de l’ajout du résultat', error);
      setMessage('Erreur lors de l’ajout du résultat : ' + error.message);
      setMessageColor('red');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <h1>MIAGique</h1>
        <button className="back" onClick={handleBack}>Retour</button>
      </header>
      <h2>Ajouter un Résultat</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <form>
        <label>Participant:</label>
        {/* Dropdown list of participants */}
        <select value={participantId} onChange={(e) => setParticipantId(e.target.value)} required>
            <option value="">Sélectionner un participant</option>
            {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                    {participant.prenom} {participant.nom}
                </option>
            ))}
        </select>
        <label>Épreuve:</label>
        {/* Dropdown list of epreuves */}
        <select value={epreuveId} onChange={(e) => setEpreuveId(e.target.value)} required>
          <option value="">Sélectionner une épreuve</option>
          {epreuves.map((epreuve) => (
            <option key={epreuve.id} value={epreuve.id}>
              {epreuve.nom}
            </option>
          ))}
        </select>
        <label>Temps:</label>
        <input type="text" value={temps} onChange={(e) => setTemps(e.target.value)} required />
        <label>Position:</label>
        <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} required />
        <button type="submit" onClick={handleSubmit}>Valider</button>
      </form>
    </div>
  );
};

export default AddResult;