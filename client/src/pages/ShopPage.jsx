import React, { useState, useEffect } from "react";
import "../styles/pages/Shop.css";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import api from '../utils/api.js';


const Shop = () => {
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const userId = sessionStorage.getItem("userId")

  useEffect(() => {

    const fetchItems = async () => {
      try {
        console.log("fetch all items from shop")
        const response = await api.get("/shop/items");
        setItems(response.data);
      } catch (error) {
        console.error("Ошибка загрузки предметов:", error);
      }
    };

    const fetchCoins = async () => {
      try {
        const response = await api.get(`/user/${userId}/coins`);
        setCoins(response.data.coins);
        console.log("Coins: " + response.data.coins)

      } catch (error) {
        console.error("Ошибка загрузки монет:", error);
      }
    };

    fetchItems();
    fetchCoins();
  }, []);

  const handleBuy = async (itemId) => {
    try {
      const response = await api.post(`/user/items`, {
        userId: userId,
        itemId,
      });
      console.log(`Add item ${itemId} to user ${userId}`)
      setCoins(response.data.coins);
    } catch (error) {
      console.error("Ошибка при покупке предмета:", error);
    }
  };

  return (
    <>
      <Header coins={coins} />
      <div className="main-content shop-container">
        {items.map((item) => (
          <div key={item._id} className="shop-item">
            <img src={item.imageUrl} alt={item.name} className="item-image" />
            <div className="item-info">
              <h3>{item.name}</h3>
              <button
                className="info-button"
                onMouseEnter={() => setHoveredItem(item._id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                ?
              </button>
              {hoveredItem === item._id && (
                <div className="tooltip">{item.description}</div>
              )}
            </div>
            <button className="buy-button" onClick={() => handleBuy(item._id)}>
              Купить за {item.price} монет
            </button>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
};

export default Shop;
