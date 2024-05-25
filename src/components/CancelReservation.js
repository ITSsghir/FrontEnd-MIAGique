import React from 'react';

const CancelReservation = () => {
  const reservations = [
    { id: 1, name: 'Reservation 1' },
    { id: 2, name: 'Reservation 2' },
  ];

  return (
    <div className="cancel-reservation">
      <h2>Annuler Réservation</h2>
      {reservations.map(reservation => (
        <div key={reservation.id}>
          <p>{reservation.name}</p>
          <button onClick={() => console.log('API call to cancel', reservation.id)}>Annuler</button>
        </div>
      ))}
    </div>
  );
};

export default CancelReservation;
