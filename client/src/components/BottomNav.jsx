import React from "react";
import { NavLink } from "react-router-dom";
// import { Home, User, Settings } from "lucide-react";

import "../styles/BottomNav.css";

const BottomNav = () => (
  <nav>
  <NavLink to="/" >🏠</NavLink>
  <NavLink to="/profile" >👤</NavLink>
  <NavLink to="/settings" >⚙️</NavLink>
  <NavLink to="/about" >ℹ️</NavLink>
</nav>
);  

export default BottomNav;
