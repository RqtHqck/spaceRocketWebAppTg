import React, { useState, useEffect } from "react";
import "../styles/components/Header.css";
import { useDispatch, useSelector } from "react-redux";
import CoinDisplay from "../components/CoinsDisplay.jsx";
import { fetchCoins } from "../redux/coinsSlice.jsx";
import { useError } from "../context/ErrorContext"; // Подключаем useError

const Header = () => {
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
  const { coins, loading, error } = useSelector((state) => state.coins);
  const { showError } = useError();
  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url) {
      setAvatar(window.Telegram.WebApp.initDataUnsafe.user.photo_url);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCoins(userId));
  }, [dispatch]);

  // Показываем ошибку, если она появилась
  useEffect(() => {
    if (error) {
        showError(error.status, error.code, error.message); // 500 – код ошибки, можешь заменить на свой
    }
  }, [error, showError]);

  if (loading) {
    return <div>..</div>;
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
        <span className="coin-count">
          <CoinDisplay coinsAmount={coins} />
        </span>
      </div>
    </header>
  );
};

export default Header;
