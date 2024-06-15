import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import EventsList from './components/EventsList';
import Payment from './components/Payment';
import Tickets from './components/Tickets';
import ParticipantHome from './components/ParticipantHome';
import EventsListParticipant from './components/EventsListParticipant';
import ResultsAndRankings from './components/ResultsAndRankings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/events-list" element={<EventsList />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/participant-home" element={<ParticipantHome />} />
        <Route path="/events-list-participant" element={<EventsListParticipant />} />
        <Route path="/results-and-rankings" element={<ResultsAndRankings />} />
      </Routes>
    </Router>
  );
};

export default App;
