import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Dumbbell, LayoutDashboard, Utensils, PlusCircle, LineChart, User, Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCoachingRequest } from "@/api/pantry";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meals", label: "Today's Meals", icon: Utensils },
  { to: "/generate", label: "Generate Meals", icon: Sparkles },
  { to: "/workout", label: "Workout Coach", icon: Dumbbell },
  { to: "/smart", label: "Smart Features", icon: Crown },
  { to: "/add", label: "Log Food", icon: PlusCircle },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
];

function limitText(text = "", maxLength = 85) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > maxLength ? `${clean.slice(0, maxLength).trim()}...` : clean;
}

function parseBilingualCoachTip(text = "") {
  const fallback = {
    english: "Log one meal today and stay close to your calorie target.",
    hindi: "Aaj ek meal log karein aur target ke kareeb rahein.",
  };

  if (!text.trim()) return fallback;

  const english = text.match(/(?:^|\n)\s*English\s*:\s*([\s\S]*?)(?=\n\s*(?:हिंदी|Hindi)\s*:|$)/i)?.[1];
  const hindi = text.match(/(?:^|\n)\s*(?:हिंदी|Hindi)\s*:\s*([\s\S]*?)(?=\n\s*English\s*:|$)/i)?.[1];

  return {
    english: limitText(english || text.split("\n").find((line) => line.trim()) || fallback.english),
    hindi: limitText(hindi || fallback.hindi),
  };
}

export function Sidebar() {
  const { pathname } = useLocation();
  const [coachTip, setCoachTip] = useState({
    english: "Loading coaching tip...",
    hindi: "Coaching tip load ho rahi hai...",
  });

  useEffect(() => {
    let ignore = false;
    getCoachingRequest()
      .then((data) => {
        if (ignore) return;
        const text = data?.coaching || "";
        setCoachTip(parseBilingualCoachTip(text));
      })
      .catch(() => {
        if (!ignore) {
          setCoachTip({
            english: "Log a meal today and keep your routine on track.",
            hindi: "Aaj meal log karein — chhote kadam, bade badlav.",
          });
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card/80 backdrop-blur-xl px-4 py-6 sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-3 mb-8">
        <img
          src="/logos/fitnova-logo-light.png"
          alt="FitNova AI"
          className="h-11 w-11 object-contain shrink-0"
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
                pathname === it.to || (it.to === "/smart" && (pathname === "/pantry" || pathname === "/premium"))
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
        <p className="text-xs opacity-80">AI Coach · English + Hindi</p>
        <div className="mt-2 space-y-2">
          <p className="text-sm font-semibold leading-snug">{coachTip.english}</p>
          <p className="text-xs font-medium leading-snug text-white/85">{coachTip.hindi}</p>
        </div>
      </div>
    </aside>
  );
}
