import { Route } from "react-router-dom";
import SuperAdminLayout from "@/superadmin/layout/SuperAdminLayout";
import SuperAdminDashboard from "@/superadmin/pages/Dashboard";
import SuperAdminUserProfile from "@/superadmin/pages/UserProfile";
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
    </Route>,
  ];
}
