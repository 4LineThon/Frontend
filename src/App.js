import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Minju from "./minju/Minju";
import NumberInput from "./number-input/NumberInput";
import NumberInputDay from "./number-input(day)/NumberInputDay";
import SelectDate from "./select-date/SelectDate";
import LogIn from "./login/login";
import "./App.css";
import GroupAvailability from "./groupAvailability/GroupAvailability";
import Result from "./result/Result";
const router = createBrowserRouter(
  [
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
    // 모든 경로가 잘못된 경우 /SelectDate로 리디렉션
    {
      path: "*",
      element: <Navigate to="/SelectDate" />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_skipActionErrorRevalidation: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_partialHydration: true,
      v7_fetcherPersist: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
