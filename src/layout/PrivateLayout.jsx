import { Navigate, Outlet, useLocation } from "react-router-dom";

const getToken = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="));

  if (cookie) return decodeURIComponent(cookie.split("=")[1]);
  return localStorage.getItem("token");
};

const PrivateLayout = () => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateLayout;
