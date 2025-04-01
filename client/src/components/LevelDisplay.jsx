// LevelDisplay.js
import React from 'react';
import "../styles/components/LevelDisplay.css";

const LevelDisplay = ({ level = 0 }) => {

  return (
    <div className="level-display">
      <span className="level-amount">{level}</span>
    </div>
  );
};

export default LevelDisplay;