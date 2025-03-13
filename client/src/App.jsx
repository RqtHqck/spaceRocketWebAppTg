import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Game from "./pages/Game";
// import Map from "./pages/Map";
// import LeaderBoard from "./pages/LeaderBoard";
// import Settings from "./pages/Settings";

import "./styles/App.css";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";


const App = () => (
  <Router>
      <div className="app-container">
        <div className="app">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Game />} />
              {/* <Route path="/map" element={<Map />} />
              <Route path="/leaders" element={<LeaderBoard />} />
              <Route path="/settings" element={<Settings />} /> */}
            </Routes>
          </div>
          <BottomNav />
        </div>
      </div>
  </Router>
);

export default App;
