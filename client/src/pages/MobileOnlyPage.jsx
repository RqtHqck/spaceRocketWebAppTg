// pages/MobileOnlyPage.js
import React from 'react';
import '../styles/pages/MobileOnlyPage.css';
import '../styles/App.css'


const MobileOnlyPage = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Доступно только в Telegram Web Apps</h1>
        <p className="description">
          Для игры необходимо:
          <br />
          1. Открыть приложение через Telegram
          <br />
          2. Использовать мобильное устройство
        </p>
        <a
          href="https://t.me/space_rocket_project_bot"
          className="button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть в Telegram
        </a>
      </div>
    </div>
  );
};

export default MobileOnlyPage;