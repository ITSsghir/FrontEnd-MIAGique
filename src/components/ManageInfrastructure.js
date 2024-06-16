import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageInfrastructures = () => {
  const { infrastructures, getInfrastructures, updateInfrastructure, deleteInfrastructure } = useAuth();
  const navigate = useNavigate();
  getInfrastructures();

  const [editModeInfrastructureId, setEditModeInfrastructureId] = useState(null); // Track infrastructure in edit mode
  const [infrastructure, setInfrastructure] = useState({
    id: '',
    nom: '',
    adresse: '',
    capacite: ''
  }); // State to manage infrastructure data being edited

  const [updatedInfrastructure, setUpdatedInfrastructure] = useState({
    id: '',
    nom: '',
    adresse: '',
    capacite: ''
  }); // State to store changes temporarily

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');

  const handleRemove = async (id) => {
    try {
      await deleteInfrastructure(id);
      setMessage('Infrastructure supprimée avec succès');
      setMessageColor('green');
      getInfrastructures();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'infrastructure', error);
      setMessage('Erreur lors de la suppression de l\'infrastructure');
      setMessageColor('red');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const { nom, adresse, capacite } = updatedInfrastructure;
      await updateInfrastructure(id, nom, adresse, capacite);
      setMessage('Infrastructure modifiée avec succès');
      setMessageColor('green');
      setEditModeInfrastructureId(null); // Exit edit mode
      getInfrastructures();
    } catch (error) {
      console.error('Erreur lors de la modification de l\'infrastructure', error);
      setMessage('Erreur lors de la modification de l\'infrastructure');
      setMessageColor('red');
    }
  };

  const toggleEditMode = (id) => {
    const selectedInfrastructure = infrastructures.find(infra => infra.id === id);
    setInfrastructure(selectedInfrastructure); // Set the infrastructure being edited
    setUpdatedInfrastructure(selectedInfrastructure); // Set the updated infrastructure
    setEditModeInfrastructureId(id === editModeInfrastructureId ? null : id); // Toggle edit mode
  };

  const isEditMode = (infrastructureId) => {
    return editModeInfrastructureId === infrastructureId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfrastructure(prevState => ({
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
      <h2>Gérer les Infrastructures Sportives</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Capacité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {infrastructures.map(infrastructure => (
            <tr key={infrastructure.id}>
              <td>{infrastructure.id}</td>
              <td>{isEditMode(infrastructure.id) ? (
                <input
                  type="text"
                  name="nom"
                  value={updatedInfrastructure.nom}
                  onChange={handleInputChange}
                  required
                />
              ) : infrastructure.nom}</td>
              <td>{isEditMode(infrastructure.id) ? (
                <input
                  type="text"
                  name="adresse"
                  value={updatedInfrastructure.adresse}
                  onChange={handleInputChange}
                  required
                />
              ) : infrastructure.adresse}</td>
              <td>{isEditMode(infrastructure.id) ? (
                <input
                  type="number"
                  name="capacite"
                  value={updatedInfrastructure.capacite}
                  onChange={handleInputChange}
                  required
                />
              ) : infrastructure.capacite}</td>
              <td>
                {isEditMode(infrastructure.id) ? (
                  <button onClick={() => handleUpdate(infrastructure.id)}>Valider</button>
                ) : (
                  <button onClick={() => toggleEditMode(infrastructure.id)}>Modifier</button>
                )}
                <button style={{ backgroundColor: "red" }} onClick={() => handleRemove(infrastructure.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageInfrastructures;
