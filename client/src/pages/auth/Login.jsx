import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Пример простого сохранения пользователя в localStorage
    localStorage.setItem("user", JSON.stringify({ email, password }));
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Вход</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Войти</button>
      </form>
      <p className="auth-switch">
        Нет аккаунта? <span className="auth-link" onClick={() => navigate("/register")}>Зарегистрироваться</span>
      </p>
    </div>
  );
};

export default Login;
