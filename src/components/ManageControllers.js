import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageControllers = () => {
  const [controllers, setControllers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchControllers = async () => {
      const result = await axios.get('http://localhost:8080/api/controllers');
      setControllers(result.data);
    };
    fetchControllers();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/controllers/${id}`);
      setControllers(controllers.filter(controller => controller.id !== id));
      alert('Contrôleur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du contrôleur', error);
      alert('Erreur lors de la suppression du contrôleur');
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
      <h2>Gérer les Contrôleurs</h2>
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
          {controllers.map(controller => (
            <tr key={controller.id}>
              <td>{controller.id}</td>
              <td>{controller.firstName}</td>
              <td>{controller.lastName}</td>
              <td>{controller.email}</td>
              <td>
                <button onClick={() => handleRemove(controller.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageControllers;
