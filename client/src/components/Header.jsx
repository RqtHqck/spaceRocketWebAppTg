import React, { useState, useEffect } from "react";
import "../styles/components/Header.css";
import { useDispatch, useSelector } from "react-redux";
import CoinDisplay from "../components/CoinsDisplay.jsx";
import LevelDisplay from '../components/LevelDisplay.jsx';
import { fetchCoins } from "../redux/coinsSlice.jsx";
import { fetchLevel } from "../redux/levelSlice.jsx";

import { useError } from "../context/ErrorContext";
import UserAvatar from './UserAvatar.jsx';

const Header = () => {
  const { showError } = useError();
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState(null);
  const { coins, loading, error } = useSelector((state) => state.coins);
  const { level } = useSelector((state) => state.level); // ✅ Добавлено

  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setAvatar(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCoins(userId));
    dispatch(fetchLevel(userId));
  }, [dispatch]);

  // Показываем ошибку, если она появилась
  useEffect(() => {
    if (error) {
        showError(error.status, error.code, error.message); // 500 – код ошибки, можешь заменить на свой
    }
  }, [error, showError]);

  if (loading) {
    return <div>...</div>;
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-avatar">
          <UserAvatar src={avatar}/>
        </div>
        <div className="header-level">
          <LevelDisplay level={level} size={'large'}/>
        </div>
      </div>
      <div className="header-right">
      <span className="coin-count">
        <CoinDisplay coinsAmount={coins} size="large"/>
      </span>
      </div>
    </header>
);
};

export default Header;
