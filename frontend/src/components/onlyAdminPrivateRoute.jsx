import { useContext } from "react";
import { currentUserContext } from "../context/userContext";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useContext(currentUserContext);

  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default OnlyAdminPrivateRoute;
