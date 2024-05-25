import React from 'react';

const PaidTickets = () => {
  const paidTickets = [
    { id: 1, name: 'Paid Ticket 1' },
    { id: 2, name: 'Paid Ticket 2' },
  ];

  return (
    <div className="paid-tickets">
      <h2>Billets payés</h2>
      {paidTickets.map(ticket => (
        <div key={ticket.id}>
          <p>{ticket.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PaidTickets;
