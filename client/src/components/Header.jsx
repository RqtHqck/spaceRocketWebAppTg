import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/components/Header.css";
import {useDispatch, useSelector} from 'react-redux';
import {fetchCoins} from '../redux/coinsSlice.jsx';  // Импортируем useSelector


const Header = () => {
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
  const { coins, loading, error } = useSelector((state) => state.coins);  // Получаем данные о монетах из Redux
  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    // Получаем аватар из Telegram WebApp
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setAvatar(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }
  }, []);


  useEffect(() => {
    dispatch(fetchCoins(userId));
  }, [dispatch]); // Зависимость от dispatch, чтобы запрос не повторялся без необходимости

  if (loading) {
    return <div>..</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


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
        <span className="coin-count">{Math.round(coins)}</span>
      </div>
    </header>
  );
};

export default Header;
