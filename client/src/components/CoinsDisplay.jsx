// CoinDisplay.js
import React from 'react';
import "../styles/components/CoinsDisplay.css";

const CoinDisplay = ({ coinsAmount }) => {

  // Округляем число до десятых
  const roundedAmount = Math.round(coinsAmount * 10) / 10;

  // Функция для форматирования числа
  const formatCoins = (amount) => {
    if (amount >= 1e9) {
      return `${(amount / 1e9).toFixed(1)}B`;  // миллиарды
    } else if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(1)}M`;  // миллионы
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(1)}K`;  // тысячи
    } else {
      return `${amount.toFixed(1)}`;  // для меньших значений
    }
  };

  return (
    <div className="coin-display">
      <span className="coin-amount">{formatCoins(roundedAmount)}</span>
      <img src="/icons/tgStar.png" alt="Coin" className="coin-image" />
    </div>
  );
};

export default CoinDisplay;
