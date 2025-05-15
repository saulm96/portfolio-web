import { createBrowserRouter } from "react-router-dom";
import HomePage from "./home/HomePage";
import StackCVPage from "./stack/StackCVPage";
import ContactPage from "./contact/ContactPage";
import ProjectsPage from "./projects/ProjectsPage";
import Root from "./Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/stack",
        element: <StackCVPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
    ],
  },
]);

export default router;
