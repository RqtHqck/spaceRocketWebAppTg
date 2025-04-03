import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import "../styles/pages/Map.css"; // Подключаем стили
import { useError } from "../context/ErrorContext.jsx";
import CoinDisplay from '../components/CoinsDisplay.jsx';
import {useDispatch} from 'react-redux';
import {setLevel} from '../redux/levelSlice.jsx';


export default function MapPage() {
  const dispatch = useDispatch();
  const { showError } = useError();
  const [planets, setPlanets] = useState([]);
  const [game, setGame] = useState(null);
  const [userPlanets, setUserPlanets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Загружена ли картика
  const bottomRef = useRef(null); // Реф для прокрутки вниз


  const userId = sessionStorage.getItem("userId");


  const fetchUserGameData = async () => {
    try {
      const response = await api.get(`/game/${userId}`);
      if (response.status !== 200) {
        throw new Error("Ошибка загрузки данных");
      }
      const game = response.data;
      setGame(game);
      setUserPlanets(game.unlockedPlanets)
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      showError(error.status, error.code);
    }
  };

  const fetchPlanets = async () => {
    try {
      const response = await api.get("/planets/all");
      const sortedPlanets = response.data
        .map((planet, index) => ({ ...planet, index })) // Добавляем индекс
        .sort((a, b) => a.index - b.index); // Сортируем по индексу
      setPlanets(sortedPlanets);

      // Прокручиваем вниз после загрузки данных
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 300);

    } catch (error) {
      console.error("Ошибка загрузки планет:", error);
    }
  };

  useEffect(() => {
    fetchUserGameData();
    fetchPlanets();
  }, [userId]);


  const handleAction = async (planetId) => {
    try {
      const updatedGame = await api.post("/game/planet/buy", { userId, planetId });
      console.log(`Buy planet ${planetId} for user ${userId}`);
      console.log(updatedGame.data.level)
      dispatch(setLevel(updatedGame.data.level))
      fetchUserGameData();
    } catch (error) {
      console.error(`Ошибка при покупке планеты: `, error);
      showError(error.status, error.code);
    }
  };

  return (
    <div className="map-container">
      <div className="planets-list">
        {planets.map((planet, i) => {
          const userPlanet = userPlanets.find(up => up.planetId._id === planet._id);
          const isOwned = !!userPlanet;
          const isLeft = i % 2 === 0;

// Проверка предыдущей планеты
          const prevPlanet = i < planets.length - 1 ? planets[i + 1] : null;
          const isPrevOwned = prevPlanet
            ? userPlanets.some(up => up.planetId._id === prevPlanet._id)
            : true; // Для последней планеты в списке (которая у вас первая) считаем, что предыдущая owned

          // Условия доступности
          const hasEnoughLevel = game?.level >= planet.requiredLevel;
          const hasEnoughCoins = game?.coins >= planet.unlockCost;
          const canBuy = isPrevOwned && hasEnoughLevel && hasEnoughCoins;

          return (
            <div
              key={planet._id}
              className={`planet ${isLeft ? 'left' : 'right'} ${isOwned ? 'owned' : ''}`}
              style={isOwned ? { "--glow-color": planet.color } : {}}
            >
              <img
                src={planet.imageUrl}
                alt={planet.name}
                className="planet-image"
                onLoad={() => setIsLoaded(true)}
                style={{ display: isLoaded ? 'block' : 'none' }}
              />
              <div className="planet-name">{planet.name}</div>

              {isOwned ? (
                // Checkbox is planet exists
                <img src="/icons/check.png" alt="Unlocked" className="planet-check" />
              ) : (


                <div className="planet-info">
                  <button
                    className={`planet-button ${canBuy ? 'active' : 'disabled'}`}
                    disabled={!canBuy}
                    onClick={() => handleAction(planet._id)}
                  >
                    {!isPrevOwned ? (
                      "Buy previous"
                    ) : !hasEnoughLevel ? (
                      `Level: ${planet.requiredLevel}`
                    ) : !hasEnoughCoins ? (
                      <span>Buy: <CoinDisplay coinsAmount={planet.unlockCost} /></span>
                    ) : (
                      <span>Buy: <CoinDisplay coinsAmount={planet.unlockCost} /></span>
                    )}
                  </button>
                </div>


              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
