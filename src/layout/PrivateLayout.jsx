import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "@/lib/auth-token";

const PrivateLayout = () => {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateLayout;
