import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AddParticipant = () => {
  const [messageColor, setMessageColor] = useState('green');
  const [message, setMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { delegations, createParticipant, getDelegations } = useAuth();
  const navigate = useNavigate();
  getDelegations();

  // Create a dropdown list of delegations
  const [delegationName, setDelegationName] = useState('');
  const delegation = delegations.find((delegation) => delegation.nom === delegationName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding participant', firstName, lastName, email, password, delegation.id);
      await createParticipant(firstName, lastName, email, delegation.id, password);
      // Clean up form
      setFirstName('');
      setLastName('');
      setEmail('');
      setDelegationName('');
      setPassword('');
      setMessage('Participant ajouté avec succès');
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de l’ajout du participant', error);
      setMessage('Erreur lors de l’ajout du participant');
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
      <h2>Ajouter un Participant</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <form onSubmit={handleSubmit}>
        <label>Prénom:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <label>Nom:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Mot de passe:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Délégation:</label>
        {/* Dropdown list of delegations */}
        <select value={delegationName} onChange={(e) => setDelegationName(e.target.value)} required>
          <option value="">Sélectionner une délégation</option>
          {delegations.map((delegation) => (
            <option key={delegation.id} value={delegation.nom}>
              {delegation.nom}
            </option>
          ))}
        </select>
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default AddParticipant;
