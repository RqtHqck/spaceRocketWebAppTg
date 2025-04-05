// LevelDisplay.js
import React from 'react';
import "../styles/components/LevelDisplay.css";

const LevelDisplay = ({ level = 0, size = "normal" }) => {

  return (
    <div className={`user-level-badge ${size}-level`}>
      <span>{level}</span>
      <img src="/rocket/rocket-lvl.png" alt="lvl"/>
    </div>
)
  ;
};

export default LevelDisplay;