import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/components/Header.css";

const Header = () => {
  const [avatar, setAvatar] = useState(null);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    // Получаем аватар из Telegram WebApp
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setAvatar(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }

    // Запрашиваем количество коинов
    const fetchCoins = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;

        const response = await axios.get(`/api/user/${userId}/coins`);
        setCoins(response.data.coins);
      } catch (error) {
        console.error("Ошибка загрузки коинов:", error);
      }
    };

    fetchCoins();
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <img
          src={avatar || "/icons/profile.png"}
          alt="Avatar"
          className="avatar no-interaction"
        />
      </div>
      <div className="header-right">
        <img
          src="/icons/tgStar.png"
          alt="Coins"
          className="coin-image no-interaction"
        />
        <span className="coin-count">{coins}</span>
      </div>
    </header>
  );
};

export default Header;
