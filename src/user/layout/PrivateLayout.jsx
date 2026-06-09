import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "@/lib/auth-token";
import { useMobileAppMode } from "@/hooks/use-mobile-app-mode";

const PrivateLayout = () => {
  const location = useLocation();
  const token = getAuthToken();
  useMobileAppMode();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateLayout;
