import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PublicPath } from "./components/constants/routes.c";
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import Login from "./pages/login/Login";
import MenusList from "./components/side-menu-bar/MenusList";
import Register from "./pages/register";
import { AlertWrap } from "./components/alert";
import { useAppSelector } from "./redux";
import {
  selectAlertMessage,
  selectAlertType,
  selectShowAlert,
} from "./redux/meta/selector";
import "./i18n/config";
import { useNavigate } from "react-router-dom";
import { CustomerVerify } from "./pages/user-thanks";

const App = () => {
  const showAlertMessage = useAppSelector(selectAlertMessage);
  const showAlertType = useAppSelector(selectAlertType);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    document.title = process.env.REACT_APP_APPLICATION_NAME || "Scheduler";
  }, []);
  useEffect(() => {
    if(location.pathname == '/'){
      navigate(PublicPath.login);
    }
  }, []);

  return (
    <>
      {showAlertMessage != "" && (
        <AlertWrap message={showAlertMessage} variant={showAlertType} />
      )}
      <Routes>
        <Route
          path={PublicPath.login}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path={PublicPath.register}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path={PublicPath.userVerify}
          element={
            <PublicRoute>
              <CustomerVerify />
            </PublicRoute>
          }
        />

        {MenusList.map(({ to, Component, label }: any, index: number) => {
          return (
            <Route
              key={index}
              path={to}
              element={
                <PrivateRoute label={label}>
                  <Component />
                </PrivateRoute>
              }
            />
          );
        })}
      </Routes>
    </>
  );
};

export default App;
