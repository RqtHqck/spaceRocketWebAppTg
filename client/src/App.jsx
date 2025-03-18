// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GamePage from './pages/GamePage';
import MobileOnlyPage from './pages/MobileOnlyPage';
import ProtectedRoute from './components/ProtectedRoute';
import ShopPage from './pages/ShopPage.jsx';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="app">
        <Routes>
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            }
          />
          <Route path="/mobile-only" element={<MobileOnlyPage />} />
          <Route path="/" element={<Navigate to="/game" replace />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;