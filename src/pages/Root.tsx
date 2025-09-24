import { Outlet, useLocation } from "react-router-dom";

import NavBar from "../components/NavBar/NavBar";

const Root = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <header style={{ opacity: isHomePage ? 0 : 1 }}>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>©️Copyright 2025. All rights reserved. Saul Mora </p>
      </footer>
    </>
  );
};

export default Root;