// components/ScoreBar.jsx
import React from "react";
import "../styles/components/ScoreBar.css";

const ScoreBar = ({ expRequired, expUpdate }) => {
  const fillPercent = Math.min((expUpdate / expRequired) * 100, 100);

  return (
    <div className="score-bar-wrapper">
      <div
        className="score-bar-fill"
        style={{ width: `${fillPercent}%` }}
      />
    </div>
  );
};

export default ScoreBar;