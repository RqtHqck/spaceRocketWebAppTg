// CoinDisplay.js
import React from 'react';
import "../styles/components/CoinsDisplay.css";

const CoinDisplay = ({ coinsAmount = 0 }) => {
  const validAmount = Number.isFinite(coinsAmount) ? coinsAmount : 0;
  const roundedAmount = Math.round(validAmount * 10) / 10;

  const formatCoins = (amount) => {
    if (amount >= 1e21) {
      return `${(amount / 1e21).toFixed(1)}Sx`;  // Секстиллионы
    } else if (amount >= 1e18) {
      return `${(amount / 1e18).toFixed(1)}Qi`;  // Квинтиллионы
    } else if (amount >= 1e15) {
      return `${(amount / 1e15).toFixed(1)}Qa`;  // Квадриллионы
    } else if (amount >= 1e12) {
      return `${(amount / 1e12).toFixed(1)}T`;   // Триллионы
    } else if (amount >= 1e9) {
      return `${(amount / 1e9).toFixed(1)}B`;    // Миллиарды
    } else if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(1)}M`;    // Миллионы
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(1)}K`;    // Тысячи
    } else if (amount >= 1e2) {
      return `${(amount / 1e2).toFixed(1)}H`;    // Сотни
    } else if (amount >= 1e1) {
      return `${amount.toFixed(1)}`;              // Десятки
    } else {
      return amount.toFixed(1);                   // Единицы
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