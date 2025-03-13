import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Пример простого сохранения данных в localStorage
    localStorage.setItem("user", JSON.stringify({ email, password }));
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Регистрация</h2>
      <form className="auth-form" onSubmit={handleRegister}>
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
        <button type="submit" className="auth-button">Зарегистрироваться</button>
      </form>
      <p className="auth-switch">
        Уже есть аккаунт? <span className="auth-link" onClick={() => navigate("/login")}>Войти</span>
      </p>
    </div>
  );
};

export default Register;
