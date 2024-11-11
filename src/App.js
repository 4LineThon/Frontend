import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Minju from "./minju/Minju";
import NumberInput from "./number-input/NumberInput";
import NumberInputDay from "./number-input(day)/NumberInputDay"
import SelectDate from "./select-date/SelectDate";
import LogIn from "./login/login";
import "./App.css";
import GroupAvailability from "./groupAvailability/GroupAvailability";
import Result from "./result/Result";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/SelectDate" />,
  },
  {
    path: "/minju",
    element: <Minju />,
  },
  {
    path: "/GroupAvailability",
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
  },
  {
    path: "/Result",
    element: <Result />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
