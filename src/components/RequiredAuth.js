import React, { useContext } from "react";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../context/authProvider";

const RequiredAuth = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  console.log(auth);
  const location = useLocation();
  const navigate = useNavigate();
  return auth?.roles.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequiredAuth;
