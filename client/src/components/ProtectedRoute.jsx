import React from "react";
import { Navigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

const ProtectedRoute = ({ children }) => {
  const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!isMobile || !tgId) {
    return <Navigate to="/mobile-only" replace />;
  }
  return children;
};

export default ProtectedRoute;
