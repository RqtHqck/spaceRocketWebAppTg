import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import "../styles/pages/Map.css"; // Подключаем стили
import { useError } from "../context/ErrorContext.jsx";
import CoinDisplay from '../components/CoinsDisplay.jsx'; // Импорт экшена

export default function MapPage() {
  const [planets, setPlanets] = useState([]);
  const [game, setGame] = useState(null);
  const [userPlanets, setUserPlanets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Загружена ли картика
  const { showError } = useError();
  const bottomRef = useRef(null); // Реф для прокрутки вниз

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
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
        const response = await api.get("/planets");
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

    fetchUserData();
    fetchPlanets();
  }, [userId]);

  return (
    <div className="map-container">
      <div className="planets-list">
        {planets.map((planet, i) => {
          const userPlanet = userPlanets.find(up => up.planetId._id === planet._id);
          const isOwned = !!userPlanet;
          const isLeft = i % 2 === 0;

// Проверка предыдущей планеты
          const prevPlanet = i < planets.length - 1 ? planets[i + 1] : null; // Изменили на i + 1
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
              className={`planet ${isLeft ? 'left' : 'right'}`}
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
                  >
                    {!isPrevOwned ? (
                      "Buy previous"
                    ) : !hasEnoughLevel ? (
                      `Level: ${planet.requiredLevel}`
                    ) : !hasEnoughCoins ? (
                      <span>Buy: {planet.unlockCost}</span>
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
