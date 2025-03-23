import React, { useState, useEffect } from "react";
import "../styles/pages/Shop.css";
import CoinDisplay from '../components/CoinsDisplay.jsx';
import api from '../utils/api.js';
import { useDispatch } from 'react-redux';
import { setCoins } from '../redux/coinsSlice.jsx';
import {useError} from '../context/ErrorContext.jsx';


const Shop = () => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const { showError } = useError();

  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("fetch all items from shop");
        const response = await api.get("/shop/items");
        setItems(response.data);
      } catch (error) {
        console.error("Ошибка загрузки предметов:", error);
        showError(error.status, error.code);

      }
    };

    const fetchUserItems = async () => {
      try {
        console.log(`fetch user ${userId} items`);
        const response = await api.get(`/user/${userId}/items`);
        setUserItems(response.data.items);
      } catch (error) {
        console.error("Ошибка загрузки предметов пользователя:", error);
        showError(error.status, error.code);
      }
    };

    fetchItems();
    fetchUserItems();
  }, []);


  const handleAction = async (itemId, isOwned) => {
    try {
      const transactionResponse = await api.post("/user/items", { userId, itemId });
      console.log(transactionResponse)
      console.log(`${isOwned ? "Upgrade" : "Buy"} item ${itemId} for user ${userId}`);
      // Обновляем список предметов пользователя после покупки/улучшения
      const responseUserItems = await api.get(`/user/${userId}/items`);
      dispatch(setCoins(transactionResponse.data.userBalance)); // Обновляем монеты в Redux
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
          const isOwned = !!userItem;
          const price = isOwned ? userItem.upgradePrice : item.basePrice;

          // Значение добычи сейчас и после улучшения с округлением
          let currentIncome = isOwned ? Math.round(userItem.income) : 0;
          let nextIncome = isOwned ? Math.round(userItem.income * item.incomeMultiplier) : Math.round(item.baseIncome);

          return (
            <div
              key={item._id}
              className={`shop-item ${activeItem === item._id ? 'active' : ''}`}
              onClick={() => handleCardClick(item._id)} // При клике добавляем класс активного состояния
            >
              {/* Level Badge */}
              <div className="level-badge">
                {isOwned ? userItem.level : 1}
              </div>

              <div className="item-image-container">
                <img src={item.imageUrl} alt={item.name} className="item-image no-interaction"/>
              </div>
              <div className="item-info">
                <h3 className="item-title">{item.name}</h3>
              </div>
              <button className="buy-button" onClick={() => handleAction(item._id, isOwned)}>
                {isOwned ? "Улучшить" : "Купить"}
                <CoinDisplay coinsAmount={price} />
              </button>
              <div className="income-info">
                <CoinDisplay coinsAmount={currentIncome} /> → <CoinDisplay coinsAmount={nextIncome} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Shop;
