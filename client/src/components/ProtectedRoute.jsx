import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import api from "../utils/api";

const ProtectedRoute = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tgIdFromWebApp = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!isMobile || !tgIdFromWebApp) {
      // Если не с мобильного устройства или не из WebApp Telegram
      return <Navigate to="/mobile-only" replace/>;
    }

    if (localStorage.getItem("userId")) {
      setUserId(localStorage.getItem("userId"));
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/user/tg/${tgIdFromWebApp}`);
        const user = response.data;

        if (user) {
          setUserId(user._id);
          localStorage.setItem("userId", user._id);  // Сохраняем userId в localStorage
        } else {
          // Если пользователь не найден, перенаправляем на страницу создания пользователя
          setError("Пользователь не найден. Возможно, Вы не зашли в телеграм бот и не ввели /start");
        }
      } catch (err) {
        setError("Ошибка при загрузке данных пользователя");
      }
    };
    fetchUserData();
  }, []);

  return children;
};

export default ProtectedRoute;
