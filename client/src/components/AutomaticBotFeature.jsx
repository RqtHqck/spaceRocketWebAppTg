import React, { useEffect, useState } from "react";
import "../styles/components/AutomaticBot.css";

const TIMER_KEY = "automaticBotFeatureTimerExpiresAt";

const AutomaticBotFeature = ({ hasAutomatic, onClick, showIndicator }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(TIMER_KEY);
    if (saved) {
      const expiresAt = parseInt(saved, 10);
      const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemainingTime(timeLeft);
    }
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            localStorage.removeItem(TIMER_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  const handleClick = () => {
    const timer = localStorage.getItem(TIMER_KEY);
    if (timer) return;
    if (onClick) onClick();

    const expiresAt = Date.now() + 5 * 60 * 1000;
    localStorage.setItem(TIMER_KEY, expiresAt.toString());
    setRemainingTime(5 * 60);
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!hasAutomatic) return null;

  return (
    <div className="automatic-icon-wrapper">
      <div className="automatic-icon-container" onClick={handleClick}>
        <img
          src="/icons/game/image-inverted.svg"
          alt="Automatic"
          className="automatic-icon"
        />
        {showIndicator && remainingTime === 0 && (
          <img
            src="/icons/annoying-red.png"
            alt="Indicator"
            className="automatic-icon-indicator"
          />
        )}
      </div>

      {remainingTime > 0 && (
        <div className="automatic-icon-timer">{formatTime(remainingTime)}</div>
      )}
    </div>
  );
};

export default AutomaticBotFeature;
