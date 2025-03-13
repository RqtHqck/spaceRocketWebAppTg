import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Game from "./pages/Game";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// import Map from "./pages/Map";
// import LeaderBoard from "./pages/LeaderBoard";
// import Settings from "./pages/Settings";

import "./styles/App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";


const App = () => {
  return (
    <Router>
    <div className="app-container">
      <div className="app">
        <Header />
        <div className="main-content">
          <Routes>
            {/* Авторизация */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Защищённые маршруты */}
            <Route path="/" element={<ProtectedRoute><Game /></ProtectedRoute>} />
            {/* <Route path="/map" element={<Map />} />
            <Route path="/leaders" element={<LeaderBoard />} />
            <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </div>
        <BottomNav />
      </div>
    </div>
    </Router>
  )
}
export default App;
