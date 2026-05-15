import { Route } from "react-router-dom";
import Welcome from "@/website/pages/Welcome";
import Login from "@/website/pages/Login";
import Signup from "@/website/pages/Signup";

/** Public marketing & auth routes (website area). */
export function websiteRouteElements(PageTransition) {
  return [
    <Route key="welcome-home" path="/" element={<PageTransition><Welcome /></PageTransition>} />,
    <Route key="welcome" path="/welcome" element={<PageTransition><Welcome /></PageTransition>} />,
    <Route key="login" path="/login" element={<PageTransition><Login /></PageTransition>} />,
    <Route key="signup" path="/signup" element={<PageTransition><Signup /></PageTransition>} />,
  ];
}
