import React, { useState, useEffect } from "react";
import "../styles/components/Header.css";

const Header = ({ coins }) => {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setAvatar(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }
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
