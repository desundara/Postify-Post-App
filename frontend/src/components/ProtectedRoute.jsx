import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);
  if (authState.loading) return null;
  if (!authState.status) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
