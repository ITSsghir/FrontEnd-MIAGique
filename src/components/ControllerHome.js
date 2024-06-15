import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ControllerHome.css';

const ControllerHome = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Appel à l'API pour récupérer les billets
    axios.get('http://localhost:8080/api/controller/tickets')
      .then(response => setTickets(response.data))
      .catch(error => console.error('Erreur lors de la récupération des billets:', error));
  }, []);

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="controller-home">
      <header className="controller-home-header">
        <div className="left">
          <h2>Welcome, Controller</h2>
        </div>
        <div className="center">
          <h1>MIAGique</h1>
        </div>
        <div className="right">
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="controller-home-main">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID de l'épreuve</th>
              <th>ID du spectateur</th>
              <th>Prix</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.eventId}</td>
                <td>{ticket.spectatorId}</td>
                <td>{ticket.price}</td>
                <td>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ControllerHome;
