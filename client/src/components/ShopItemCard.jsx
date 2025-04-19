import React from "react";
import "../styles/components/ShopItemCard.css";
import CoinDisplay from './CoinsDisplay.jsx';
import LevelDisplay from './LevelDisplay.jsx';

const ShopItemCard = ({
    item,
    userItem,
    game,
    isActive,
    onCardClick,
    onAction
  }) => {

  const isOwned = !!userItem;
  const price = isOwned ? userItem.upgradePrice : item.basePrice;
  const currentIncome = isOwned ? Math.round(userItem.income) : 0;
  const nextIncome = isOwned
    ? Math.round(userItem.income * item.incomeMultiplier)
    : Math.round(item.baseIncome);

  const levelLocked = game.level < item.levelRequired;
  const coinsLocked = game.coins < price;
  const isLocked = levelLocked || coinsLocked;

  return (
    <div
      className={`shop-item ${isActive ? 'active' : ''}`}
      onClick={() => onCardClick(item._id)}
    >
      <div className="level-badge">
        {isOwned ? userItem.level : 1}
      </div>

      <div className="item-image-container">
        <img src={item.imageUrl} alt={item.name} className="item-image no-interaction"/>
      </div>

      <div className="item-info">
        <h3 className="item-title">{item.name}</h3>
      </div>

      <button
        className={`buy-button ${isLocked ? "disabled" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLocked) {
            onAction(item._id, isOwned);
          }
        }}
      >
        {isLocked ? (
          levelLocked ? (
            <span>
              <img src="/icons/map/lock.png" alt="Locked" className="item-locked-img"/>
              <LevelDisplay level={item.levelRequired} size="normal"/>
            </span>
          ) : (
            <span>
              <img src="/icons/map/lock.png" alt="Locked" className="item-locked-img"/>
              <CoinDisplay coinsAmount={price} size="normal"/>
            </span>
          )
        ) : (
          <>
            {isOwned ? (<img src="/icons/arrow-up.png" className="upgrade-img"/>) : 'Buy'}{' '}
            <span className="normal-coin">
        <CoinDisplay coinsAmount={price} size="small"/>
      </span>
          </>
        )}
      </button>


      {isLocked ? (
        ""
      ) : (
        <div className="income-info">
          <CoinDisplay coinsAmount={currentIncome} size="small"/> →
          <CoinDisplay coinsAmount={nextIncome} size="small"/>
        </div>
      )
      }
    </div>
  );
};

export default ShopItemCard;
