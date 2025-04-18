import React, { useState, useEffect } from "react";
import "../styles/pages/Game.css";
import ScoreBar from "../components/ScoreBar";
import Rocket from "../components/Rocket.jsx";
import AutomaticBotFeature from '../components/AutomaticBotFeature.jsx';
import { useDispatch } from 'react-redux';
import api from "../utils/api";
import { useError } from "../context/ErrorContext";
import { setCoins } from '../redux/coinsSlice.jsx';
import { setLevel } from '../redux/levelSlice.jsx';

const Game = () => {
  const dispatch = useDispatch();
  const { showError } = useError();
  const userId = sessionStorage.getItem("userId");

  const [scale, setScale] = useState(1);
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [expRequired, setExpRequired] = useState(0);
  const [expUpdateRequired, setExpUpdateRequired] = useState(0);
  const [game, setGame] = useState(null);
  const [gameExp, setGameExp] = useState(0);
  const [hasAutomatic, setHasAutomatic] = useState(false);
  const [clickScale, setClickScale] = useState(1);

  const progress = expRequired > 0 ? Math.min(gameExp / expRequired, 1) : 0;
  const baseScale = 0.7 + progress * 0.5;
  const planetScale = baseScale * clickScale;

  useEffect(() => {
    const loadData = async () => {
      try {
        const gameData = await api.get(`/game/${userId}`);
        const game = gameData.data;
        const responsePlanet = await api.get(`/planets/filters?index=${game.currentPlanetIndex}`);
        setGame(game);
        if (game.lastRewarded) setHasAutomatic(game.lastRewarded);

        setCurrentPlanet(responsePlanet.data);
        setExpRequired(game.expRequired.total);
        setExpUpdateRequired(game.expRequired.toNext);
        setGameExp(game.exp);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        showError(error.status, error.code);
      }
    };

    loadData();
  }, [userId, showError]);

  const handleRocketClick = async () => {
    try {
      const gameResponse = await api.post("/game/coins", { userId });
      const gameData = gameResponse.data;

      dispatch(setCoins(gameData.coins));
      dispatch(setLevel(gameData.level));
      setGame(gameData);
      setExpRequired(gameData.expRequired.total);
      setExpUpdateRequired(gameData.expRequired.toNext);
      setGameExp(gameData.exp);
    } catch (error) {
      console.error("Ошибка при нажатии на ракету", error);
      showError(error.status, error.code);
    }
  };


  const handleAutomaticIconClick = async () => {
    try {
      const gameResponse = await api.post("/game/coins/absentReward", { userId });
      const gameData = gameResponse.data;

      dispatch(setCoins(gameData.coins));
      dispatch(setLevel(gameData.level));
      setGame(gameData);
      setExpRequired(gameData.expRequired.total);
      setExpUpdateRequired(gameData.expRequired.toNext);
      setGameExp(gameData.exp);
    } catch (error) {
      console.error("Ошибка при нажатии на кнопку автоматизации", error);
      showError(error.status, error.code);
    }
  };

  return (
    <>
      <div className="game-container">
        {!isLoaded && <div className="planet-placeholder"></div>}

        {currentPlanet && (
          <img
            src={currentPlanet.imageUrl}
            alt="Планета"
            className="current-planet no-interaction"
            onLoad={() => setIsLoaded(true)}
            style={{
              display: isLoaded ? "block" : "none",
              "--planet-glow-color": currentPlanet.color || "rgba(255, 100, 50, 0.8)",
              transform: `scale(${planetScale})`,
              transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />
        )}

        <div className="top-bar">
          <ScoreBar expRequired={expRequired} expUpdate={gameExp} />
        </div>

        <Rocket
          scale={scale}
          setScale={setScale}
          setClickScale={setClickScale}
          setGame={setGame}
          setExpRequired={setExpRequired}
          setExpUpdateRequired={setExpUpdateRequired}
          setGameExp={setGameExp}
          userId={userId}
          onRocketClick={handleRocketClick}
        />
      </div>

      {hasAutomatic && (
        <AutomaticBotFeature
          hasAutomatic={hasAutomatic}
          onClick={handleAutomaticIconClick}
          showIndicator={true} // когда нужно — сделаешь false, если не нужно
        />

      )}
    </>
  );
};

export default Game;
