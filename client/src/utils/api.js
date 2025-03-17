import axios from "axios";
import api from "../utils/api";

// Создаём инстанс Axios
const api = axios.create({
  baseURL: "http://localhost:3001/api", // Укажи свой API URL
});

// Добавляем интерцептор для всех запросов
api.interceptors.request.use((config) => {
  const tgId = localStorage.getItem("tgId");
  if (tgId) {
    config.headers["x-tg-user"] = tgId;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
