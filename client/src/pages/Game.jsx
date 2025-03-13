import React, { useState, useEffect } from "react";
import "../styles/pages/Game.css";
import rocketImg from "../assets/rocket.png";
import planetImg from "../assets/mars.png";
const tgStar = "/icons/tgStar.png"; // Картинка из public/

const Game = () => {
  const [scale, setScale] = useState(1);
  const [particles, setParticles] = useState([]);

  const handleClick = (event) => {
    setScale(1.1);
    setTimeout(() => setScale(1), 100);

    // Координаты ракеты
    const rocketRect = event.target.getBoundingClientRect();
    const rocketX = rocketRect.left + rocketRect.width / 2;
    const rocketY = rocketRect.top + rocketRect.height / 3;

    // Генерация случайных направлений для частиц
    const getRandom = (min, max) => Math.random() * (max - min) + min;

    const newParticles = Array.from({ length: 3 }).map(() => ({
      id: Math.random(),
      img: tgStar,
      x: rocketX,
      y: rocketY,
      dx: getRandom(-2, 2), // Разлёт влево-вправо
      dy: getRandom(-2, 2), // Разлёт вверх-вниз
      rotate: getRandom(-30, 30), // Вращение
      size: getRandom(10, 36), // Случайный размер
      opacity: 1,
      angle: getRandom(0, 180), // Угол для вращения
      speed: getRandom(1, 2) // Скорость для частиц
    }));

    setParticles((prev) => [...prev, ...newParticles]);
  };

  useEffect(() => {
    if (particles.length === 0) return;

    let frame;
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.dx * particle.speed, // Движение по горизонтали
            y: particle.y + particle.dy * particle.speed, // Движение по вертикали
            angle: particle.angle + Math.random() * 0.1 - 0.05, // Вращение частиц
            opacity: particle.opacity - 0.02, // Уменьшение прозрачности
          }))
          .filter((particle) => particle.opacity > 0) // Убираем частицы, когда они исчезают
      );

      frame = requestAnimationFrame(updateParticles);
    };

    frame = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(frame);
  }, [particles]);

  return (
    <div className="game-container">
      <div className="score-bar"></div>
      <div className="planet-sun"></div>
      <img src={planetImg} alt="Планета" className="planet no-interaction" />

      {particles.map((particle) => (
        <img
          key={particle.id}
          src={particle.img}
          alt="Частица"
          className="particle"
          style={{
            position: "absolute", // Обеспечиваем абсолютное позиционирование частиц
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`, // Устанавливаем случайный размер
            height: `${particle.size}px`,
            transform: `rotate(${particle.angle}deg)`,
            opacity: particle.opacity
          }}
        />
      ))}
      
      <div class="rocket-sun"></div>
      <img
        src={rocketImg}
        alt="Ракета"
        className="rocket no-interaction"
        onClick={handleClick}
        style={{
          transform: `scale(${scale}) rotate(-15deg) translate(20px, -20px)`,
        }}
      />
    </div>
  );
};

export default Game;
