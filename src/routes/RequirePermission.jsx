import React from "react";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permission";

const RequirePermission = ({ perm, children }) => {
  if (!hasPermission(perm)) {
    return <Navigate to="/403" replace />;
  }
  return children;
};

export default RequirePermission;
