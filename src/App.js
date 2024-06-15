import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import EventsList from './components/EventsList';
import Payment from './components/Payment';
import Tickets from './components/Tickets';
import ResultsAndRankings from './components/ResultsAndRankings';
import ControllerHome from './components/ControllerHome';
import OrganizerHome from './components/OrganizerHome';
import AddDelegation from './components/AddDelegation';
import RemoveDelegation from './components/RemoveDelegation';
import AddParticipant from './components/AddParticipant';
import MaxParticipants from './components/MaxParticipants';
import ManageParticipants from './components/ManageParticipants';
import AddEvent from './components/AddEvent';
import MaxEvents from './components/MaxEvents';
import ManageEvents from './components/ManageEvents';
import AddController from './components/AddController';
import ManageControllers from './components/ManageControllers';

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
        <Route path="/results-and-rankings" element={<ResultsAndRankings />} />
        <Route path="/controller-home" element={<ControllerHome />} />
        <Route path="/organizer-home" element={<OrganizerHome />} />
        <Route path="/add-delegation" element={<AddDelegation />} />
        <Route path="/remove-delegation" element={<RemoveDelegation />} />
        <Route path="/add-participant" element={<AddParticipant />} />
        <Route path="/max-participants" element={<MaxParticipants />} />
        <Route path="/manage-participants" element={<ManageParticipants />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/max-events" element={<MaxEvents />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/add-controller" element={<AddController />} />
        <Route path="/manage-controllers" element={<ManageControllers />} />
      </Routes>
    </Router>
  );
};

export default App;
