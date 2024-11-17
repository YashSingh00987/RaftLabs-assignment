import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
