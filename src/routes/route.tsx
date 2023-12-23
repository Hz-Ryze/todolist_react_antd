import Login from "../pages/LoginPage";
import Home from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import { useRoutes } from "react-router-dom";
import AllTaskView from "../views/AllTaskView";

export const mainRoutes = {
  path: "/home",
  element: <Home />,
  routes: [
    {
      path: "/home/alltask",
      name: "全部任务",
      component: "./Welcome",
    },
    {
      path: "/home/mytask",
      name: "我负责的",
      component: "./Welcome",
    },
    {
      path: "/home/followtask",
      name: "我关注的",
      component: "./Welcome",
    },
    {
      path: "/home/finishedtask",
      name: "已完成的",
      component: "./Welcome",
    },
  ],
};

export const loginRoutes = {
  path: "/",
  element: <Login />,
};

export const registerRoutes = {
  path: "/register",
  element: <RegisterPage />,
};

export const errorRoutes = {
  path: "*",
  element: <Login />,
};

/**
 * Generates the routing component for the application.
 *
 * @return {JSX.Element} The routing component.
 */
export function Routing() {
  const routing = useRoutes([
    mainRoutes,
    loginRoutes,
    registerRoutes,
    errorRoutes,
  ]);
  return <>{routing}</>;
}
