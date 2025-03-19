import React, { useState, useEffect } from "react";
import "../styles/pages/Shop.css";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import api from '../utils/api.js';


const Shop = () => {
  const [items, setItems] = useState([]);
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

    fetchItems();
  }, []);

  const handleBuy = async (itemId) => {
    try {
      const response = await api.post(`/user/items`, {
        userId: userId,
        itemId,
      });
      console.log(`Add item ${itemId} to user ${userId}`)
    } catch (error) {
      console.error("Ошибка при покупке предмета:", error);
    }
  };

  return (
    <>
      <div className="shop-container">
        {items.map((item) => (
          <div key={item._id} className="shop-item">
            <div className="item-image-container">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
            </div>
            <div className="item-info">
              <h3 className="item-title">{item.name}</h3>
              {/*<div className="tooltip-wrapper">*/}
              {/*  <button*/}
              {/*    className="info-button"*/}
              {/*    onMouseEnter={() => setHoveredItem(item._id)}*/}
              {/*    onMouseLeave={() => setHoveredItem(null)}*/}
              {/*  >*/}
              {/*    <span>?</span>*/}
              {/*  </button>*/}
              {/*  {hoveredItem === item._id && (*/}
              {/*    <div className="tooltip">{item.description}</div>*/}
              {/*  )}*/}
              {/*</div>*/}
            </div>
            <button className="buy-button" onClick={() => handleBuy(item._id)}>
              Купить за {item.price}₿
            </button>
          </div>
        ))}
      </div>
    </>

  );
};

export default Shop;
