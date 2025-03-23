import { createContext, useState, useContext } from "react";
import Error from "../components/Error";

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (status, message) => {
    setError({ status, message });
    setTimeout(() => setError(null), 200000); // Скрыть через 3 сек
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {error && <Error status={error.status} message={error.message} onClose={() => setError(null)} />}
    </ErrorContext.Provider>
  );
};
