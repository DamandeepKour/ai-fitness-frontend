import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, Plus, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/meals", label: "Meals", icon: Utensils },
  { to: "/add", label: "Log", icon: Plus, fab: true },
  { to: "/generate", label: "AI", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
];

function isActive(pathname, to) {
  if (to === "/dashboard") return pathname === "/dashboard";
  if (to === "/profile") {
    return (
      pathname === "/profile" ||
      pathname.startsWith("/notifications") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/meal-history")
    );
  }
  if (to === "/generate") {
    return pathname === "/generate" || pathname === "/workout" || pathname.startsWith("/smart") || pathname.startsWith("/pantry") || pathname.startsWith("/premium");
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden mobile-app-tabbar" aria-label="Main">
      <div className="mobile-app-tabbar-inner">
        {tabs.map((it) => {
          const Icon = it.icon;
          const active = isActive(pathname, it.to);

          if (it.fab) {
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className="mobile-app-tab fab -mt-5"
                aria-label={it.label}
              >
                <span className="mobile-app-fab">
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <span className="mobile-app-tab-label">{it.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={cn("mobile-app-tab", active && "active")}
            >
              <span className={cn("mobile-app-tab-icon", active && "active")}>
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.5 : 2} />
              </span>
              <span className="mobile-app-tab-label">{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
