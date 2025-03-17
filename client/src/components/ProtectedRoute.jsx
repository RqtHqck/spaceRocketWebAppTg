import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

const ProtectedRoute = ({ children }) => {
  const [tgId, setTgId] = useState(localStorage.getItem("tgId") || null);

  useEffect(() => {
    const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!isMobile || !tgId) {
      return <Navigate to="/mobile-only" replace/>;
    }
    setTgId(tgId)
    localStorage.setItem("tgId", tgId);
  }, []);
  return children;
};

export default ProtectedRoute;
