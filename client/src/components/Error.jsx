import { useState, useEffect } from "react";
import "../styles/components/Error.css"; // Подключаем стили

const Error = ({ status, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  const imagePath =
    status >= 500 ? "/icons/error/error5xx.svg" : "/icons/error/error4xx.svg";

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="error-container">
      <img src={imagePath} alt="Error" className="error-icon" />
      <div className="error-text">
        {message}
      </div>
      <button className="error-close" onClick={() => setVisible(false)}>
        ✖
      </button>
    </div>
  );
};

export default Error;
