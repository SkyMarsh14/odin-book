import Login from "../pages/Login/Login";
const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <Login signUp={true} />,
  },
];

export default routes;
