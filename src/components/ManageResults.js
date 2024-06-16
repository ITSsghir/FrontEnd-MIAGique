import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageResults = () => {
  const { results, getResults, updateResult, deleteResult } = useAuth();
  const navigate = useNavigate();
  getResults();

  const [editModeResultId, setEditModeResultId] = useState(null); // Track result in edit mode
  const [result, setResult] = useState({
    id: '',
    participant: {},
    temps: '',
    epreuve: {},
    position: 0
  }); // State to manage result data being edited

  const [newResult, setNewResult] = useState({
    id: '',
    participant: {},
    temps: '',
    epreuve: {},
    position: 0
  }); // State to manage new changes before update

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');

  const handleRemove = async (id) => {
    try {
      const epreuveId = result.epreuve.id;
      const participantId = result.participant.id;
      await deleteResult(epreuveId, participantId);
      setMessage('Résultat supprimé avec succès');
      setMessageColor('green');
      getResults();
    } catch (error) {
      console.error('Erreur lors de la suppression du résultat', error);
      setMessage('Erreur lors de la suppression du résultat');
      setMessageColor('red');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const { participant, temps, epreuve, position } = newResult;
        const participantId = participant.id;
        const epreuveId = epreuve.id;
      await updateResult(id, epreuveId, participantId, temps, position);
      setMessage('Résultat modifié avec succès');
      setMessageColor('green');
      setEditModeResultId(null); // Exit edit mode
      getResults();
    } catch (error) {
      console.error('Erreur lors de la modification du résultat', error);
      setMessage('Erreur lors de la modification du résultat');
      setMessageColor('red');
    }
  };

  const toggleEditMode = (id) => {
    const selectedResult = results.find(result => result.id === id);
    setResult(selectedResult); // Set the result being edited
    setNewResult(selectedResult); // Set the newResult with current result data
    setEditModeResultId(id === editModeResultId ? null : id); // Toggle edit mode
  };

  const isEditMode = (resultId) => {
    return editModeResultId === resultId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResult(prevState => ({
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
      <h2>Gérer les Résultats</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Epreuve</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Temps ou Points</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td>{result.id}</td>
                <td>{result.epreuve.nom}</td>
                <td>{result.participant.prenom}</td>
                <td>{result.participant.nom}</td>
                <td>{isEditMode(result.id) ? (
                    <input
                        type="text"
                        name="temps"
                        value={newResult.temps}
                        onChange={handleInputChange}
                    />
                ) : (
                    result.temps
                )}
                </td>
                <td>{isEditMode(result.id) ? (
                    <input
                        type="text"
                        name="position"
                        value={newResult.position}
                        onChange={handleInputChange}
                    />
                ) : (
                    result.position
                )}
                </td>
              <td>
                {isEditMode(result.id) ? (
                  <button onClick={() => handleUpdate(result.id)}>Valider</button>
                ) : (
                  <button onClick={() => toggleEditMode(result.id)}>Modifier</button>
                )}
                <button style={{ backgroundColor: "red" }} onClick={() => handleRemove(result.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageResults;
