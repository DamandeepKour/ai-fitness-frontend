import { Route } from "react-router-dom";
import SuperAdminLayout from "@/superadmin/layout/SuperAdminLayout";
import SuperAdminDashboard from "@/superadmin/pages/Dashboard";

/** Superadmin area routes. */
export function SuperAdminRoutes({ PageTransition }) {
  return (
    <Route path="/superadmin" element={<SuperAdminLayout />}>
      <Route
        index
        element={
          <PageTransition>
            <SuperAdminDashboard />
          </PageTransition>
        }
      />
    </Route>
  );
}
