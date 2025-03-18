import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import api from "../utils/api";

const ProtectedRoute = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Start auth check");

        // const tgIdFromWebApp = window.Telegram?.WebApp?.initDataUnsafe?.user;
        const tgIdFromWebApp = "1378564412";
        const userId = sessionStorage.getItem("userId");
        console.log("userID:::" + userId)
        // if (!isMobile || !tgIdFromWebApp) {
        //   // Если не с мобильного устройства или не из WebApp Telegram
        //   return <Navigate to="/mobile-only" replace/>;
        // }

        // Если пользователь уже авторизован
        if (userId) {
          setLoading(false); // Важно обновить состояние!
          return;
        }

        // Запрос к API
        const response = await api.get(`/user/tg/${tgIdFromWebApp}`);
        if (!response.data?._id) {
          throw new Error("User not found in database");
        }

        // Сохраняем ID и завершаем загрузку
        sessionStorage.setItem("userId", response.data._id);
        console.log("UserId set:", response.data._id);
        setLoading(false);

      } catch (err) {
        console.error("Auth error:", err);
        sessionStorage.removeItem("userId");
        setLoading(false);
        setError("ОшибкаFFFFFFFFFFFFFFFFFFFFFFFFFFFFFff");
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если произошла ошибка, перенаправляем пользователя
  if (error) {
    return <Navigate to="/error" replace />;
  }

  return children;
};

export default ProtectedRoute;
