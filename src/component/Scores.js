import React from 'react';
import './Scores.css';

function names(obj) {
  return Object.keys(obj)
    .map(key => [key, obj[key]])
    .filter(([className, applies]) => applies)
    .map(([className]) => className)
    .join(' ');
}

const Scores = ({ won, lost, children }) => {
  return (
    <div className="Scores">
      <div
        className={names({
          'Scores-text': true,
          'Scores-loss': won < lost,
          'Scores-draw': won === lost,
          'Scores-victory': won > lost
        })}
      >
        <span className="teamPoints">{won}</span>
        <span className="separatorLong">-</span>
        <span className="separatorShort">:</span>
        <span className="opponentPoints">{lost}</span>
      </div>
      <div className="childrenSlot">{children}</div>
    </div>
  );
};

export default Scores;
