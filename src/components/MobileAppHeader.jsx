import { useLocation } from "react-router-dom";
import { getMobileAppTitle } from "@/lib/mobile-app-routes";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MobileAppHeader() {
  const { pathname } = useLocation();
  const title = getMobileAppTitle(pathname);

  return (
    <header className="md:hidden shrink-0 z-40 mobile-app-header">
      <div className="flex items-center justify-between gap-3 px-4 h-14">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/logos/fitnova-mark.svg"
            alt=""
            className="h-8 w-8 object-contain shrink-0"
            style={{ filter: "saturate(1.15) drop-shadow(0 2px 6px rgba(6,182,212,0.3))" }}
          />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
              FitNova AI
            </p>
            <p className="text-sm font-semibold truncate leading-tight mt-0.5">{title}</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
