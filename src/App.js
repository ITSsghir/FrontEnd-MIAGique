import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import SpectatorHome from './components/SpectatorHome';
import EventsList from './components/EventsList';
import Payment from './components/Payment';
import Tickets from './components/Tickets';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/spectatorHome" element={<SpectatorHome />} />
          <Route path="/events-list" element={<EventsList />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
