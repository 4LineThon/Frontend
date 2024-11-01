import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Minju from "./minju/Minju";
import NumberInput from "./number-input/NumberInput";
import Youbin from "./select-date/SelectDate";
import Home from "./Home";
import "./App.css";

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
    path: "/NumberInput",
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