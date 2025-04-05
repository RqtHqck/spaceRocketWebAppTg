// CoinDisplay.js
import React from 'react';
import "../styles/components/CoinsDisplay.css";

const CoinDisplay = ({ coinsAmount = 0, size = "normal" }) => {
  const validAmount = Number.isFinite(coinsAmount) ? coinsAmount : 0;
  const roundedAmount = Math.round(validAmount * 10) / 10;

  const formatCoins = (amount) => {
    if (amount >= 1e21) return `${(amount / 1e21).toFixed(1)}Sx`;
    if (amount >= 1e18) return `${(amount / 1e18).toFixed(1)}Qi`;
    if (amount >= 1e15) return `${(amount / 1e15).toFixed(1)}Qa`;
    if (amount >= 1e12) return `${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
    return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
  };

  return (
    <span className={`coin-display ${size}-coin`}>
      <span className="coin-amount">{formatCoins(roundedAmount)}</span>
      <img src="/icons/tgStar.png" alt="Coin" className="coin-image" />
    </span>
  );
};

export default CoinDisplay;