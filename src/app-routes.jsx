import { Navigate, Route } from "react-router-dom";
import { websiteRouteElements } from "@/website/routes";
import { userRouteElements } from "@/user/routes";
import { superAdminRouteElements } from "@/superadmin/routes";

/**
 * All application routes in one place.
 * PageWrap — animated route shell; StableWrap — auth pages (no route fade).
 */
export function getAppRoutes(PageWrap, StableWrap = PageWrap) {
  return [
    ...websiteRouteElements(PageWrap, StableWrap),
    ...userRouteElements(PageWrap),
    ...superAdminRouteElements(PageWrap),
    <Route key="not-found" path="*" element={<Navigate to="/dashboard" replace />} />,
  ];
}
