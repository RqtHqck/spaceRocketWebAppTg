import React, { useState, useEffect } from "react";
import "../styles/pages/Game.css";
import rocketImg from "../assets/rocket.png";
import planetImg from "../assets/mars.png";
const tgStar = "/icons/tgStar.png";
import { useDispatch } from 'react-redux';
import { setCoins } from '../redux/coinsSlice.jsx';
import api from "../utils/api";
import { useError } from "../context/ErrorContext";

const Game = () => {
  const [scale, setScale] = useState(1);
  const [particles, setParticles] = useState([]);
  const dispatch = useDispatch();
  const { showError } = useError();

  const userId = sessionStorage.getItem("userId");


  useEffect(() => {

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


  const handleClick = async (event) => {
    console.log(`handleClick: user with id ${userId} had pushed the rocket button.`);
    setScale(1.1);
    setTimeout(() => setScale(1), 100);

    const gameContainer = event.currentTarget.closest('.game-container');
    const containerRect = gameContainer.getBoundingClientRect();
    const rocketRect = event.target.getBoundingClientRect();
    const rocketX = rocketRect.left - containerRect.left + rocketRect.width / 2;
    const rocketY = rocketRect.top - containerRect.top + rocketRect.height / 3;

    const getRandom = (min, max) => Math.random() * (max - min) + min;

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

    try {
      const response = await api.post("/user/coins", { userId });

      if (response.status !== 200) {
        throw new Error("Ошибка загрузки данных");
      }

      const userData = response.data;
      dispatch(setCoins(userData.coins));
      console.log(`New coins value: ${userData.coins}`);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      showError(error.status, error.code);
    }
  };



  return (
    <>
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
          
          <div className="rocket-sun"></div>
          {/*<button className="rocket-button no-interaction" >*/}
            <img
              src={rocketImg}
              alt="Ракета"
              className="rocket-img"
              style={{
                transform: `scale(${scale}) rotate(-15deg) translate(20px, -20px)`,
              }}
              onClick={handleClick}
            />
          {/*</button>*/}
        </div>
    </>
  );
};

export default Game;