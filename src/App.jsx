import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import PrivateLayout from "./layout/PrivateLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./routes/index";
import MealsPage from "./routes/meals";
import GeneratePage from "./routes/generate";
import AddPage from "./routes/add";
import ProgressPage from "./routes/progress";
import ProfilePage from "./routes/profile";
import MealHistoryPage from "./routes/meal-history";
import NotificationsPage from "./routes/notifications";
import PrivacyPage from "./routes/privacy";

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
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/meals" element={<PageTransition><MealsPage /></PageTransition>} />
          <Route path="/generate" element={<PageTransition><GeneratePage /></PageTransition>} />
          <Route path="/add" element={<PageTransition><AddPage /></PageTransition>} />
          <Route path="/progress" element={<PageTransition><ProgressPage /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
          <Route path="/meal-history" element={<PageTransition><MealHistoryPage /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
        </Route>

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