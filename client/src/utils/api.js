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


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const serverError = error.response.data.error;
      return Promise.reject({
        status: serverError?.status || error.response.status,
        code: serverError?.code || 'UNKNOWN_ERROR',
        // message: serverError?.message || error.message,
        details: serverError?.details || null
      });
    }
    return Promise.reject(error);
  }
);



export default api;
