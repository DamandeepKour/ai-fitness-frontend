import { Route } from "react-router-dom";
import SuperAdminLayout from "@/superadmin/layout/SuperAdminLayout";
import SuperAdminDashboard from "@/superadmin/pages/Dashboard";
import SuperAdminUserProfile from "@/superadmin/pages/UserProfile";
import SuperAdminMyProfile from "@/superadmin/pages/MyProfile";
import SuperAdminNotifications from "@/superadmin/pages/Notifications";
import SuperAdminAIPage from "@/superadmin/pages/AI";
import SuperAdminBusinessPage from "@/superadmin/pages/Business";
import SuperAdminHealthPage from "@/superadmin/pages/Health";
import SuperAdminNutritionPage from "@/superadmin/pages/Nutrition";
import SuperAdminRetentPage from "@/superadmin/pages/Retent";
import SuperAdminLogin from "@/superadmin/pages/Login";
import SuperAdminSignup from "@/superadmin/pages/Signup";

/** Superadmin area routes. */
export function superAdminRouteElements(PageTransition) {
  return [
    <Route
      key="superadmin-login"
      path="/superadmin/login"
      element={<SuperAdminLogin />}
    />,
    <Route
      key="superadmin-signup"
      path="/superadmin/signup"
      element={<SuperAdminSignup />}
    />,
    <Route key="superadmin" path="/superadmin" element={<SuperAdminLayout />}>
      <Route index element={<PageTransition><SuperAdminDashboard /></PageTransition>} />
      <Route
        path="users/:id"
        element={<PageTransition><SuperAdminUserProfile /></PageTransition>}
      />
      <Route
        path="profile"
        element={<PageTransition><SuperAdminMyProfile /></PageTransition>}
      />
      <Route
        path="notifications"
        element={<PageTransition><SuperAdminNotifications /></PageTransition>}
      />
      <Route
        path="ai"
        element={<PageTransition><SuperAdminAIPage /></PageTransition>}
      />
      <Route
        path="business"
        element={<PageTransition><SuperAdminBusinessPage /></PageTransition>}
      />
      <Route
        path="health"
        element={<PageTransition><SuperAdminHealthPage /></PageTransition>}
      />
      <Route
        path="nutrition"
        element={<PageTransition><SuperAdminNutritionPage /></PageTransition>}
      />
      <Route
        path="retent"
        element={<PageTransition><SuperAdminRetentPage /></PageTransition>}
      />
    </Route>,
  ];
}
