import React, { useState, useEffect } from "react";
import "../styles/pages/Shop.css";
import CoinDisplay from '../components/CoinsDisplay.jsx';
import ShopItemCard from '../components/ShopItemCard.jsx';
import api from '../utils/api.js';
import { useDispatch } from 'react-redux';
import { setCoins } from '../redux/coinsSlice.jsx';
import { setLevel } from '../redux/levelSlice.jsx';
import { useError } from '../context/ErrorContext.jsx';


const Shop = () => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [game, setGame] = useState(1); // по умолчанию 1
  const [activeItem, setActiveItem] = useState(null);
  const { showError } = useError();

  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("fetch all items");
        const response = await api.get("/items");
        setItems(response.data);
      } catch (error) {
        console.error("Ошибка загрузки предметов:", error);
        showError(error.status, error.code);
      }
    };

    const fetchUserItems = async () => {
      try {
        console.log(`fetch user ${userId} items`);
        const response = await api.get(`/game/items/${userId}`);
        setUserItems(response.data.items);
      } catch (error) {
        console.error("Ошибка загрузки предметов пользователя:", error);
        showError(error.status, error.code);
      }
    };

    const fetchGame = async () => {
      try {
        const response = await api.get(`/game/reduced/${userId}`);
        setGame(response.data);
      } catch (error) {
        console.error("Ошибка загрузки игры:", error);
        showError(error.status, error.code);
      }
    };

    fetchItems();
    fetchUserItems();
    fetchGame();
  }, []);


  const handleAction = async (itemId, isOwned) => {
    try {
      let gameResponse;
      if (isOwned) {
        gameResponse = await api.post("/game/item/buy", { userId, itemId });
      } else {
        gameResponse = await api.post("/game/item/upgrade", { userId, itemId });
      }
      console.log(`${isOwned ? "Upgrade" : "Buy"} item ${itemId} for user ${userId}`);
      setGame(gameResponse.data);

      // Обновляем список предметов пользователя после покупки/улучшения
      const responseUserItems = await api.get(`/game/items/${userId}`);
      dispatch(setCoins(gameResponse.data.coins));
      dispatch(setLevel(gameResponse.data.level));
      setUserItems(responseUserItems.data.items);
    } catch (error) {
      console.error(`Ошибка при ${isOwned ? "улучшении" : "покупке"} предмета:`, error);
      showError(error.status, error.code);
    }
  };

  const handleCardClick = (itemId) => {
    setActiveItem(itemId);  // Устанавливаем активную карточку
  };

  return (
    <>
      <div className="shop-container">
        {items.map((item) => {
          const userItem = userItems.find(userItem => userItem.itemId._id === item._id);
          return (
              <ShopItemCard
                key={item._id}
                item={item}
                userItem={userItem}
                game={game}
                isActive={activeItem === item._id}
                onCardClick={handleCardClick}
                onAction={handleAction}
              />
          );
        })}
      </div>
    </>
  );
};

export default Shop;
