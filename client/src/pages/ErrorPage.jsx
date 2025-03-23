import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/Error.css';

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем сообщение об ошибке из состояния навигации
  const error = location.state?.error || {};
  const errorMessage = error.message || 'Произошла неизвестная ошибка';
  const errorDetails = error.details || 'Дополнительной информации нет';

  return (
    <div className="error-page-container">
      <h1>⚠️ Ошибка</h1>
      <div className="error-content">
        <p className="error-message">{errorMessage}</p>
        <pre className="error-details">{errorDetails}</pre> {/* Показываем подробности ошибки */}

        <div className="error-actions">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Назад
          </button>

          <button
            onClick={() => navigate('/')}
            className="home-button"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
