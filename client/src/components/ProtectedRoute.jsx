import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";
import api from "../utils/api";


const ProtectedRoute = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Telegram WebApp initialized");

        const tgIdFromWebApp = "1378564412";
        let userId = sessionStorage.getItem("userId");

        // Если не мобильное устройство или нет данных из WebApp
        // if (!isMobile || !tgIdFromWebApp) {
        //   console.log("Not mobile or no TG data");
        //   setError({
        //     message: "Доступ только с мобильных устройств",
        //     details: "Попробуйте зайти с телефона",
        //   });
        //   setLoading(false);
        //   return;
        // }

        if (userId) {
          console.log("User ID found in sessionStorage:", userId);
          setLoading(false);
          await api.patch(`/users/${userId}/activity`, { lastOnline:new Date().toISOString() })
          return;
        }

        // Запрос на API для получения пользователя
        console.log("TgId: " + tgIdFromWebApp);
        const response = await api.get(`/users/tg/${tgIdFromWebApp}`);
        console.log("Response data:", response.data);

        if (!response.data?._id) {
          throw new Error(`User with tgId ${tgIdFromWebApp} not found.`);
        }

        userId = response.data._id;

        // Сохраняем ID пользователя в sessionStorage
        sessionStorage.setItem("userId", userId);
        await api.patch(`/users/${userId}/activity`, { lastOnline:new Date().toISOString() })

        console.log("UserId set:", userId);
        setLoading(false);
      } catch (err) {
        console.error("Auth error:", err);
        sessionStorage.removeItem("userId");
        setLoading(false);
        setError({
          message: "Ошибка авторизации.",
          details: err.response?.data?.message || err.message || "Неизвестная ошибка",
        });
      }
    };

    checkAuth();
  }, []);  // Пустой массив зависимостей, чтобы выполнить один раз при монтировании


  // Логирование состояния
  useEffect(() => {
    console.log("Loading state: ", loading);
    console.log("Error state: ", error);
  }, [loading, error]);


  // Пока идет загрузка, показываем индикатор
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если есть ошибка, переходим на страницу ошибки
  if (error) {
    return <Navigate to="/error" state={{ error }} replace />;
  }

  // После загрузки отображаем дочерние компоненты
  return <Outlet />;
};

export default ProtectedRoute;
