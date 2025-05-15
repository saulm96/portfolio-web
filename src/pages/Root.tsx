import { Outlet} from "react-router-dom";

import NavBar from "../components/NavBar/NavBar";

const Root = () => {
     return (
    <>
      <header>
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