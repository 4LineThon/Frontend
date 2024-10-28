import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Minju from "./minju/Minju";
import Yunji from "./yunji/Yunji";
import Youbin from "./youbin/Youbin";
import Home from "./Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/minju",
    element: <Minju />,
  },
  {
    path: "yunji",
    element: <Yunji />,
  },
  {
    path: "youbin",
    element: <Youbin />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
