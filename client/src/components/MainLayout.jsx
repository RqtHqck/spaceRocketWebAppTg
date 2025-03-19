import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  console.log("MainLayout рендерится");
  return (
    <>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
};

export default MainLayout;
