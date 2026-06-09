/** Logged-in user routes that use the native-style mobile app shell. */
export const MOBILE_APP_ROUTE_PREFIXES = [
  "/dashboard",
  "/meals",
  "/generate",
  "/add",
  "/progress",
  "/profile",
  "/meal-history",
  "/notifications",
  "/privacy",
  "/smart",
  "/pantry",
  "/premium",
];

export function isMobileAppRoute(pathname) {
  return MOBILE_APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const MOBILE_APP_TITLES = {
  "/dashboard": "Home",
  "/meals": "Meals",
  "/generate": "AI Planner",
  "/add": "Log Food",
  "/progress": "Progress",
  "/profile": "Profile",
  "/meal-history": "History",
  "/notifications": "Alerts",
  "/privacy": "Privacy",
  "/smart": "Smart",
  "/pantry": "Pantry",
  "/premium": "Premium",
};

export function getMobileAppTitle(pathname) {
  if (MOBILE_APP_TITLES[pathname]) return MOBILE_APP_TITLES[pathname];
  const match = Object.entries(MOBILE_APP_TITLES).find(([path]) => pathname.startsWith(path));
  return match?.[1] ?? "FitNova";
}
