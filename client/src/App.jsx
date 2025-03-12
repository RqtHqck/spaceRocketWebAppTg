import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Map from "./pages/Map";
// import LeaderBoard from "./pages/LeaderBoard";
// import Settings from "./pages/Settings";

import "./styles/App.css";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import HomeScreen from "./components/HomeScreen";

const App = () => (
  // <Router>
      <div className="app-container">
        {/* <div className="app"> */}
          <Header />
          <div className="content">
            {/* <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/leaders" element={<LeaderBoard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes> */}
          </div>
          <BottomNav />
        </div>
      </div>
  // </Router>
);

export default App;
