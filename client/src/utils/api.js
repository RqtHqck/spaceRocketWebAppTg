import axios from "axios";

// Создаём инстанс Axios
const api = axios.create({
  // baseURL: "https://c192d03b1a59650ca762921b6ae80b0e.serveo.net/api",
  baseURL: "http://localhost:3000/api",
});

// Добавляем интерцептор для всех запросов
api.interceptors.request.use((config) => {
  const userId = sessionStorage.getItem("userId");
  if (userId) {
    config.headers["x-userId"] = userId;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
