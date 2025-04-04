import React, { useState, useEffect } from "react";
import "../styles/pages/Game.css";
const tgStar = "/icons/tgStar.png";
import ScoreBar from "../components/ScoreBar";
import { useDispatch } from 'react-redux';
import api from "../utils/api";
import { useError } from "../context/ErrorContext";
import { setCoins } from '../redux/coinsSlice.jsx';
import { setLevel } from '../redux/levelSlice.jsx';

const Game = () => {
  const dispatch = useDispatch();
  const { showError } = useError();
  const userId = sessionStorage.getItem("userId");

  const [scale, setScale] = useState(1); // Установка масштаба
  const [particles, setParticles] = useState([]); // Отрисовка частиц

  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // Загружена ли картика

  const [expRequired, setExpRequired] = useState(0);
  const [expUpdateRequired, setExpUpdateRequired] = useState(0);
  const [gameExp, setGameExp] = useState(0); // текущий опыт



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


  useEffect(() => {
    fetchCurrentPlanet();
  }, []);


  const fetchCurrentPlanet = async () => {
    try {
      const gameResponse = await api.get(`/game/${userId}`);
      const responsePlanet = await api.get(`/planets/filters?index=${gameResponse.data.currentPlanetIndex}`);
      setCurrentPlanet(responsePlanet.data);

      const expRequired = gameResponse.data.expRequired;
      setExpRequired(expRequired.total);
      setExpUpdateRequired(expRequired.toNext);
      setGameExp(gameResponse.data.exp); // Обновляем текущий опыт пользователя
    } catch (error) {
      console.error("Ошибка загрузки планет:", error);
    }
  };



  const handleClick = async (event) => {
    console.log(`handleClick: user with id ${userId} had pushed the rocket button.`);
    setScale(1.1);
    setTimeout(() => setScale(1), 100);

    const gameContainer = event.currentTarget.closest('.game-container');
    const containerRect = gameContainer.getBoundingClientRect();
    const rocketRect = event.target.getBoundingClientRect();
    const rocketX = rocketRect.left - containerRect.left + rocketRect.width * 0.5; // Смещаем вправо (70% ширины ракеты)
    const rocketY = rocketRect.top - containerRect.top + rocketRect.height * 0.6; // Смещаем вниз (90% высоты ракеты)

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
      const gameResponse = await api.post("/game/coins", { userId });
      const gameData = gameResponse.data;
      const expRequired = gameData.expRequired;

      dispatch(setCoins(gameData.coins));
      dispatch(setLevel(gameData.level));
      setExpRequired(expRequired.total);
      setExpUpdateRequired(expRequired.toNext);
      setGameExp(gameData.exp); // Обновляем текущий опыт

      console.log(expRequired);
      console.log(`New coins value: ${gameData.coins}`);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      showError(error.status, error.code);
    }
  };


  return (
    <>
      <div className="game-container">

        {/* круг-плейсхолдер пока планета не прогрузилась */}
        {!isLoaded && <div className="planet-placeholder"></div>}

        {/* планета */}
        {currentPlanet && (
          <img
            src={currentPlanet.imageUrl}
            alt="Планета"
            className="current-planet no-interaction"
            onLoad={() => setIsLoaded(true)}
            style={{
              display: isLoaded ? "block" : "none",
              "--planet-glow-color": currentPlanet.color || "rgba(255, 100, 50, 0.8)"
            }}
          />
        )}

        {/* Шкала опыта */}
        <div className="top-bar">
          <ScoreBar expRequired={expRequired} expUpdate={gameExp}/>
        </div>

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

        <img
          src="/rocket/rocket.png"
          alt="Ракета"
          className="rocket-img"
          style={{
            transform: `scale(${scale}) rotate(-15deg) translate(20px, -20px)`,
          }}
          onClick={handleClick}
        />
      </div>
    </>
  );
};

export default Game;