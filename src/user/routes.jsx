import { Route } from "react-router-dom";
import PrivateLayout from "@/user/layout/PrivateLayout";
import Dashboard from "@/user/routes/index";
import MealsPage from "@/user/routes/meals";
import GeneratePage from "@/user/routes/generate";
import AddPage from "@/user/routes/add";
import ProgressPage from "@/user/routes/progress";
import ProfilePage from "@/user/routes/profile";
import MealHistoryPage from "@/user/routes/meal-history";
import NotificationsPage from "@/user/routes/notifications";
import PrivacyPage from "@/user/routes/privacy";
import SmartFeaturesPage from "@/user/routes/smart";
import PantryPage from "@/user/routes/pantry";
import PremiumPage from "@/user/routes/premium";

//User Routes
export function userRouteElements(PageTransition) {
  return [
    <Route key="user-layout" element={<PrivateLayout />}>
      <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
      <Route path="/meals" element={<PageTransition><MealsPage /></PageTransition>} />
      <Route path="/generate" element={<PageTransition><GeneratePage /></PageTransition>} />
      <Route path="/workout" element={<PageTransition><GeneratePage /></PageTransition>} />
      <Route path="/add" element={<PageTransition><AddPage /></PageTransition>} />
      <Route path="/progress" element={<PageTransition><ProgressPage /></PageTransition>} />
      <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
      <Route path="/meal-history" element={<PageTransition><MealHistoryPage /></PageTransition>} />
      <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
      <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
      <Route path="/smart" element={<PageTransition><SmartFeaturesPage /></PageTransition>} />
      <Route path="/pantry" element={<PageTransition><PantryPage /></PageTransition>} />
      <Route path="/premium" element={<PageTransition><PremiumPage /></PageTransition>} />
    </Route>,
  ];
}
