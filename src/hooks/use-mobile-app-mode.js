import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isMobileAppRoute } from "@/lib/mobile-app-routes";

/** Applies `mobile-app` body class on user app routes — native shell on phones only. */
export function useMobileAppMode() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isApp = isMobileAppRoute(pathname);
    document.body.classList.toggle("mobile-app", isApp);
    document.documentElement.classList.toggle("mobile-app-root", isApp);

    return () => {
      document.body.classList.remove("mobile-app");
      document.documentElement.classList.remove("mobile-app-root");
    };
  }, [pathname]);
}
