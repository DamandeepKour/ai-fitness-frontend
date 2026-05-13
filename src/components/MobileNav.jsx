import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, PlusCircle, LineChart, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/meals", label: "Meals", icon: Utensils },
  { to: "/generate", label: "AI", icon: Sparkles },
  { to: "/add", label: "Add", icon: PlusCircle },
  { to: "/progress", label: "Stats", icon: LineChart },
  { to: "/profile", label: "Me", icon: User },
];

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-card rounded-2xl px-2 py-2 flex justify-between">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <NavLink
            key={it.to}
            to={it.to}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors",
              pathname === it.to ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" />
            {it.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
