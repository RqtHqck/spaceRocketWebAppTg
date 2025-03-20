import React, { useState, useEffect } from "react";
import "../styles/pages/Shop.css";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import api from '../utils/api.js';
import { useDispatch } from 'react-redux';
import { setCoins } from '../redux/coinsSlice.jsx';


const Shop = () => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
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
      }
    };

    const fetchUserItems = async () => {
      try {
        console.log(`fetch user ${userId} items`);
        const response = await api.get(`/user/${userId}/items`);
        setUserItems(response.data.items);
      } catch (error) {
        console.error("Ошибка загрузки предметов пользователя:", error);
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
    }
  };


  return (
    <>
      <div className="shop-container">
        {items.map((item) => {
            const userItem = userItems.find(userItem => userItem.itemId._id === item._id);
          const isOwned = !!userItem;
          const price = isOwned ? userItem.upgradePrice : item.basePrice;

          return (
            <div key={item._id} className="shop-item">
              <div className="item-image-container">
                <img src={item.imageUrl} alt={item.name} className="item-image" />
              </div>
              <div className="item-info">
                <h3 className="item-title">{item.name}</h3>
              </div>
              <button className="buy-button" onClick={() => handleAction(item._id, isOwned)}>
                {isOwned ? "Улучшить" : "Купить"} {price}₿
              </button>
            </div>
          );
        })}
      </div>
    </>

  );
};

export default Shop;
