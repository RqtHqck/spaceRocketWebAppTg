import React, { useState } from "react";
import "../styles/pages/Game.css";
import rocketImg from "../assets/rocket.png";
import planetImg from "../assets/mars.png";

const Game = () => {
  const [scale, setScale] = useState(1);

  const handleClick = () => {
    setScale(1.1);
    setTimeout(() => setScale(1), 100); // Эффект нажатия
  };

  return (
    <div className="game-container">
      <img src={planetImg} alt="Планета" className="planet no-interaction" />
      <img
        src={rocketImg}
        alt="Ракета"
        className="rocket no-interaction"
        onClick={handleClick}
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
};

export default Game;
