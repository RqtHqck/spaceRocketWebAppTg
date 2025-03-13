import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/components/BottomNav.css";

const BottomNav = () => (
  <nav className="bottom-nav">
    <NavLink to="/" className="nav-link no-interaction">
      <img src="/icons/game.png" alt="Game" />
    </NavLink>
    <NavLink to="/map" className="nav-link no-interaction">
      <img src="/icons/map.png" alt="Map" />
    </NavLink>
    <NavLink to="/leaders" className="nav-link no-interaction">
      <img src="/icons/leaders.png" alt="Leaders" />
    </NavLink>
    <NavLink to="/settings" className="nav-link no-interaction">
      <img src="/icons/settings.png" alt="Settings" />
    </NavLink>
  </nav>
);

export default BottomNav;
