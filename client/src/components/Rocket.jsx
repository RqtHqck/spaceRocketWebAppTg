// components/RocketWithParticles.jsx
import React, { useState, useEffect } from 'react';

const tgStar = "/icons/tgStar.png";

const RocketWithParticles = ({ onRocketClick }) => {
  const [scale, setScale] = useState(1);
  const [particles, setParticles] = useState([]);
  const [clickScale, setClickScale] = useState(1);

  const getRandom = (min, max) => Math.random() * (max - min) + min;

  const handleClick = (event) => {
    setScale(1.1);
    setClickScale(1.05);
    setTimeout(() => {
      setScale(1);
      setClickScale(1);
    }, 100);

    const gameContainer = event.currentTarget.closest('.game-container');
    const containerRect = gameContainer.getBoundingClientRect();
    const rocketRect = event.target.getBoundingClientRect();
    const rocketX = rocketRect.left - containerRect.left + rocketRect.width * 0.5;
    const rocketY = rocketRect.top - containerRect.top + rocketRect.height * 0.6;

    const newParticles = Array.from({ length: 3 }).map(() => ({
      id: Math.random(),
      img: tgStar,
      x: rocketX,
      y: rocketY,
      dx: getRandom(-2, 2),
      dy: getRandom(-2, 2),
      rotate: getRandom(-30, 30),
      size: getRandom(10, 50),
      opacity: 1,
      angle: getRandom(0, 180),
      speed: getRandom(1, 2)
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    if (onRocketClick) onRocketClick(event);
  };

  useEffect(() => {
    let frame;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.dx * particle.speed,
            y: particle.y + particle.dy * particle.speed,
            angle: particle.angle + Math.random() * 0.1 - 0.05,
            opacity: particle.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0)
      );

      frame = requestAnimationFrame(updateParticles);
    };

    frame = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <img
          key={particle.id}
          src={particle.img}
          alt="Частица"
          className="particle"
          style={{
            position: "absolute",
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.angle}deg)`,
            opacity: particle.opacity
          }}
        />
      ))}

      <img
        src="/rocket/rocket.png"
        alt="Ракета"
        className="rocket-img"
        style={{
          transform: `scale(${scale}) rotate(-15deg) translate(20px, -20px)`,
        }}
        onClick={handleClick}
      />
    </>
  );
};

export default RocketWithParticles;
