// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout.jsx';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage.jsx';
import MobileOnlyPage from './pages/MobileOnlyPage';
import ErrorPage from './pages/ErrorPage.jsx';
import { ErrorProvider } from "./context/ErrorContext";
import MapPage from './pages/MapPage.jsx';

const App = () => {
  return (
    <ErrorProvider>
      <Router>
        <div className="app-container">
          <div className="app">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/game" element={<GamePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/map" element={<MapPage />} />

                </Route>
              </Route>
              <Route path="/mobile-only" element={<MobileOnlyPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/" element={<Navigate to="/game" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorProvider>
  );
};

export default App;