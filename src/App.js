import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Minju from "./minju/Minju";
import NumberInput from "./NumberInput/NumberInput";
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
    path: "NumberInput",
    element: <NumberInput />,
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
