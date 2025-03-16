import React, { useState, useEffect } from "react";
import "../styles/components/Header.css";

const Header = ({ coins }) => {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    console.log('DAta' + window.Telegram?.WebApp?.initDataUnsafe)
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setAvatar(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <img
          src={avatar || "https://via.placeholder.com/40"} 
          alt="Avatar"
          className="avatar no-interaction"
        />
      </div>
      <div className="header-right">
        <img
          src="../../public/icons/tgStar.png"
          alt="Coins"
          className="coin-image no-interaction"
        />
        <span className="coin-count">{coins}</span> {/* Отображаем переданные coins */}
      </div>
    </header>
  );
};

export default Header;
