import { BrowserRouter, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getAppRoutes } from "@/app-routes";


/** Auth screens animate themselves — avoid double fade with route transitions. */
const AUTH_PATHS = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/auth/magic-login",
  "/superadmin/login",
  "/superadmin/signup",
]);

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** No route-level animation (login, signup). */
export function StablePage({ children }) {
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAuth = AUTH_PATHS.has(location.pathname);

  const routes = (
    <Routes location={location} key={isAuth ? "auth" : location.pathname}>
      {getAppRoutes(PageTransition, StablePage)}
    </Routes>
  );

  if (isAuth) {
    return routes;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {routes}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
