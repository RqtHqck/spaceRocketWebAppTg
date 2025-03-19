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

        // const tgIdFromWebApp = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        console.log("Telegram WebApp initialized");
        const tgIdFromWebApp = "1378564412";
        const userId = sessionStorage.getItem("userId");

        // if (!isMobile || !tgIdFromWebApp) {
        //   // Если не с мобильного устройства или не из WebApp Telegram
        //   return <Navigate to="/mobile-only" replace/>;
        // }

        // Если пользователь уже авторизован
        if (userId) {
          console.log("User ID found in sessionStorage:", userId);
          setLoading(false); // Важно обновить состояние!
          return;
        }

        // Запрос к API
        console.log("TGID: " + tgIdFromWebApp)
        const response = await api.get(`/user/tg/${tgIdFromWebApp}`);
        console.log("Response data:", response.data);

        if (response.data && !response.data?._id) {
          throw new Error(`User with tgid ${tgIdFromWebApp} not found in database. \nfound id: ${response.data?._id}`);
        }

        // Сохраняем ID и завершаем загрузку
        sessionStorage.setItem("userId", response.data._id);
        console.log("UserId set:", response.data._id);
        setLoading(false);

      } catch (err) {
        console.error("Auth error:", err);
        sessionStorage.removeItem("userId");
        setLoading(false);
        // Отправляем более подробную информацию об ошибке
        setError({
          message: "Ошибка авторизации.",
          details: err.response?.data?.message || err.message || "Неизвестная ошибка",
        });

      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если произошла ошибка, перенаправляем пользователя
  if (error) {
    return <Navigate to="/error" state={{ error: error }} replace />;
  }


  return children;
};

export default ProtectedRoute;
