import React from "react";
import "../styles/Header.css";
// import { Avatar } from "@/components/ui/avatar";

const Header = () => (
  <header className="header">
    <img src="https://t.me/i/userpic/320/avatar.jpg" alt="User Avatar" className="avatar" />
    <h1 className="title">SpaceRocket</h1>
  </header>
);

export default Header;
