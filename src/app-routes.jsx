import { Navigate, Route } from "react-router-dom";
import { websiteRouteElements } from "@/website/routes";
import { userRouteElements } from "@/user/routes";
import { superAdminRouteElements } from "@/superadmin/routes";

/**
 * All application routes in one place.
 * Returns an array of <Route> elements — must be spread inside <Routes>, not wrapped in a custom component.
 */
export function getAppRoutes(PageTransition) {
  return [
    ...websiteRouteElements(PageTransition),
    ...userRouteElements(PageTransition),
    ...superAdminRouteElements(PageTransition),
    <Route key="not-found" path="*" element={<Navigate to="/dashboard" replace />} />,
  ];
}
