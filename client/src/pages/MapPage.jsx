import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import "../styles/pages/Map.css"; // Подключаем стили
import { useError } from "../context/ErrorContext.jsx"; // Импорт экшена

export default function MapPage() {
  const [planets, setPlanets] = useState([]);
  const [game, setGame] = useState(null);
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
        setGame(response.data);
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
          const isLeft = i % 2 === 0;
          const isUnlocked = game && game.level >= planet.requiredLevel;
          const canAfford = game && game.coins >= planet.unlockCost;

          return (
            <div
              key={planet.index}
              className={`planet ${isLeft ? "left" : "right"}`}
            >
              <img src={planet.imageUrl} alt={planet.name} className="planet-image" />

              {isUnlocked ? (
                <img src="/icons/check.png" alt="Разблокировано" className="planet-check" />
              ) : (
                <div className="planet-info">
                  <p className="planet-level">Требуется уровень {planet.requiredLevel}</p>
                  <button className={`planet-button ${canAfford ? "active" : "disabled"}`} disabled={!canAfford}>
                    {canAfford ? `Купить за ${planet.unlockCost} 💰` : "Недоступно"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} /> {/* Невидимый элемент для прокрутки вниз */}
      </div>
    </div>
  );
}
