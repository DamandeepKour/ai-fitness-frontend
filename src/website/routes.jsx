import { Route } from "react-router-dom";
import Home from "@/website/pages/Home";
import Login from "@/website/pages/Login";
import Signup from "@/website/pages/Signup";

/** Public marketing & auth routes (website area). */
export function WebsiteRoutes({ PageTransition }) {
  return (
    <>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
    </>
  );
}
