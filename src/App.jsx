import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { WebsiteRoutes } from "@/website/routes";
import { UserRoutes } from "@/user/routes";
import { SuperAdminRoutes } from "@/superadmin/routes";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -14, scale: 0.99 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <WebsiteRoutes PageTransition={PageTransition} />
        <UserRoutes PageTransition={PageTransition} />
        <SuperAdminRoutes PageTransition={PageTransition} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;
