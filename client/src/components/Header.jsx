import React, { useState, useEffect } from "react";
import "../styles/components/Header.css";

const Header = () => {
  const [avatar, setAvatar] = useState(null);
  // const [coins, setCoins] = useState(100); 

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
        <span>Coins</span>
        <img
            src="../../public/icons/tgStar.png"
            alt="Avatar"
            className="coin-image no-interaction"
          />
      </div>
    </header>
  );
};

export default Header;
