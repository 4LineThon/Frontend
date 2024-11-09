import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Minju from "./minju/Minju";
import NumberInput from "./number-input/NumberInput";
import SelectDate from "./select-date/SelectDate";
import NumberInputDay from "./number-input(day)/NumberInputDay";
import LogIn from "./login/login";
import Home from "./Home";
import "./App.css";
import GroupAvailability from "./groupAvailability/GroupAvailability";

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
    path: "/groupAvailability",
    element: <GroupAvailability />,
  },
  {
    path: "/NumberInput",
    element: <NumberInput />,
  },
  {
    path: "/SelectDate",
    element: <SelectDate />,
  },
  {
    path: "/NumberInputDay",
    element: <NumberInputDay />,
  },
  {
    path: "/LogIn",
    element: <LogIn />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
