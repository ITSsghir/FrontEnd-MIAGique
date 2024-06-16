import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ManageControllers = () => {
  const { controleurs, getControllers, updateController, deleteController } = useAuth();
  const navigate = useNavigate();
  getControllers();

  const [editModeControllerId, setEditModeControllerId] = useState(null); // Track controller in edit mode
  const [controller, setController] = useState({
    id: '',
    prenom: '',
    nom: '',
    email: ''
  }); // State to manage controller data being edited

  const [updatedController, setUpdatedController] = useState({
    id: '',
    prenom: '',
    nom: '',
    email: ''
  }); // State to store changes temporarily

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');


  const handleRemove = async (id) => {
    try {
      await deleteController(id);
      setMessage('Contrôleur supprimé avec succès');
      setMessageColor('green');
    } catch (error) {
      console.error('Erreur lors de la suppression du contrôleur', error);
      setMessage('Erreur lors de la suppression du contrôleur');
      setMessageColor('red');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const { prenom, nom, email } = updatedController;

      console.log('updatedController', updatedController);
      await updateController(id, nom, prenom, email);
      setMessage('Contrôleur modifié avec succès');
      setMessageColor('green');
      setEditModeControllerId(null); // Exit edit mode
    } catch (error) {
      console.error('Erreur lors de la modification du contrôleur', error);
      setMessage('Erreur lors de la modification du contrôleur');
      setMessageColor('red');
    }
  };

  const toggleEditMode = (id) => {
    const selectedController = controleurs.find(controller => controller.id === id);
    setController(selectedController); // Set the controller being edited
    setUpdatedController(selectedController); // Set the updated controller
    setEditModeControllerId(id === editModeControllerId ? null : id); // Toggle edit mode
  };

  const isEditMode = (controllerId) => {
    return editModeControllerId === controllerId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedController(prevState => ({
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
      <h2>Gérer les Contrôleurs</h2>
      <p style={{ color: messageColor }}>{message}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {controleurs.map(controller => (
            <tr key={controller.id}>
              <td>{controller.id}</td>
              <td>{isEditMode(controller.id) ? (
                <input
                  type="text"
                  name="prenom"
                  value={updatedController.prenom}
                  onChange={handleInputChange}
                  required
                />
              ) : controller.prenom}</td>
              <td>{isEditMode(controller.id) ? (
                <input
                  type="text"
                  name="nom"
                  value={updatedController.nom}
                  onChange={handleInputChange}
                  required
                />
              ) : controller.nom}</td>
              <td>{isEditMode(controller.id) ? (
                <input
                  type="email"
                  name="email"
                  value={updatedController.email}
                  onChange={handleInputChange}
                  required
                />
              ) : controller.email}</td>
              <td>
                {isEditMode(controller.id) ? (
                  <button onClick={() => handleUpdate(controller.id)}>Valider</button>
                ) : (
                  <button onClick={() => toggleEditMode(controller.id)}>Modifier</button>
                )}
                <button style={{backgroundColor: "red"}} onClick={() => handleRemove(controller.id)}>Enlever</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageControllers;
