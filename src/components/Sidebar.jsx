import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, PlusCircle, LineChart, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meals", label: "Today's Meals", icon: Utensils },
  { to: "/generate", label: "Generate Meals", icon: Sparkles },
  { to: "/add", label: "Log Food", icon: PlusCircle },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card/80 backdrop-blur-xl px-4 py-6 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-3 mb-8">
        <img
          src="/fitnova-logo.png"
          alt="FitNova AI"
          className="h-12 w-12 rounded-2xl object-cover shadow-sm ring-1 ring-border"
        />
        <div>
          <p className="text-sm font-semibold leading-none">FitNova AI</p>
          <p className="text-[11px] text-muted-foreground">Intelligent Fitness & Nutrition</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                pathname === it.to
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {it.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl p-4 text-white" style={{ background: "var(--gradient-hero)" }}>
        <p className="text-xs opacity-80">AI Coach</p>
        <p className="text-sm font-semibold mt-1 leading-snug">You're 320 kcal away from today's goal — keep going!</p>
      </div>
    </aside>
  );
}
