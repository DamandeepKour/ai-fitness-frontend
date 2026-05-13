import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Ring } from "@/components/Ring";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Flame, Footprints, Dumbbell, Apple, Beef, Wheat, Droplet, Sparkles } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import API from "@/api/axios";
import { getStoredUser } from "@/lib/auth-token";

const MEAL_EMOJI = {
  breakfast: "🥣",
  lunch: "🥗",
  dinner: "🍽️",
  mid_morning_snack: "🍌",
  evening_snack: "🍎",
  snack: "🍎",
};

function formatMealType(type = "Meal") {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

const motivationCards = [
  {
    title: "Nutrition First",
    quote: "Every clean meal is fuel for stronger workouts and better energy.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Move Daily",
    quote: "Consistency beats intensity. Small exercise wins every day matter most.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Positive Mindset",
    quote: "Progress is personal. Celebrate each step and keep the momentum.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
  },
];

function Dashboard() {
  const [isBooting, setIsBooting] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const res = await API.get("/dashboard/show");
        if (!ignore) setDashboard(res.data.data);
      } catch {
        if (!ignore) setError("Unable to load dashboard right now.");
      } finally {
        if (!ignore) setIsBooting(false);
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const storedUser = getStoredUser();
  const userName = dashboard?.user?.name || storedUser?.name || "there";
  const consumed = dashboard?.today?.consumed_calories ?? 0;
  const goal = dashboard?.targets?.calories ?? dashboard?.plan?.calories ?? 2200;
  const remaining = dashboard?.today?.remaining_calories ?? Math.max(goal - consumed, 0);
  const macros = dashboard?.today?.macros || {};
  const targets = dashboard?.targets || {};
  const weekData = dashboard?.graph?.length ? dashboard.graph : [];
  const todayMeals = dashboard?.meals || [];
  const weightHistory = dashboard?.weight_history || [];

  if (isBooting) {
    return (
      <AppShell>
        <Loader text="Preparing your dashboard..." />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <Card className="glass-card rounded-3xl p-6 border-0">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">{formatDate()}</p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-1">Welcome back, {userName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild size="lg" className="rounded-full">
            <Link to="/add">Log food</Link>
          </Button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-6"
      >
        <Card className="relative overflow-hidden rounded-3xl border-0 text-white">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80"
            alt="Healthy meal and workout inspiration"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/30" />
          <div className="relative p-6 md:p-8">
            <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3" /> Daily motivation
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold max-w-xl">
              Healthy food + regular exercise = the strongest version of you.
            </h2>
            <p className="mt-2 text-sm text-white/90 max-w-lg">
              Stay positive today. Your dashboard is tracking each smart choice you make.
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="glass-card lg:col-span-2 p-6 rounded-3xl border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Activity</h2>
            <span className="text-xs text-muted-foreground">Auto-synced</span>
          </div>
          <div className="flex items-center gap-8 flex-wrap">
            <div className="relative">
              <Ring value={consumed} max={goal} size={180} stroke={18} gradient="oklch(0.7 0.2 25)|oklch(0.78 0.2 50)" />
              <Ring value={42} max={60} size={140} stroke={14} gradient="oklch(0.75 0.18 145)|oklch(0.78 0.18 170)" />
              <div className="absolute inset-0" style={{ left: 0, top: 0 }}>
                <div className="flex items-center justify-center h-[180px] w-[180px] flex-col">
                  <span className="text-3xl font-semibold">{remaining}</span>
                  <span className="text-xs text-muted-foreground">kcal left</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] grid grid-cols-2 gap-3">
              <Stat icon={<Flame className="h-4 w-4" />} label="Calories" value={`${consumed}`} sub={`/ ${goal}`} tint="oklch(0.7 0.2 25)" />
              <Stat icon={<Dumbbell className="h-4 w-4" />} label="Workout" value="42" sub="min" tint="oklch(0.75 0.18 145)" />
              <Stat icon={<Footprints className="h-4 w-4" />} label="Steps" value="6,820" sub="/ 10k" tint="oklch(0.7 0.13 220)" />
              <Stat icon={<Droplet className="h-4 w-4" />} label="Water" value="1.4L" sub="/ 2.5L" tint="oklch(0.65 0.15 230)" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 rounded-3xl border-0">
          <h2 className="text-lg font-semibold">Macros</h2>
          <p className="text-xs text-muted-foreground mb-5">Today's split</p>
          <div className="space-y-4">
            <Macro icon={<Beef className="h-4 w-4" />} name="Protein" value={macros.protein || 0} max={targets.protein || 140} color="oklch(0.7 0.2 25)" unit="g" />
            <Macro icon={<Wheat className="h-4 w-4" />} name="Carbs" value={macros.carbs || 0} max={targets.carbs || 250} color="oklch(0.78 0.16 75)" unit="g" />
            <Macro icon={<Apple className="h-4 w-4" />} name="Fats" value={macros.fat || 0} max={targets.fat || 70} color="oklch(0.7 0.17 145)" unit="g" />
          </div>
        </Card>
      </div>

      <Card className="glass-card p-6 rounded-3xl border-0 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Calories — Last 7 days</h2>
            <p className="text-xs text-muted-foreground">
              Avg {Math.round(weekData.reduce((sum, item) => sum + (item.kcal || 0), 0) / Math.max(weekData.length, 1))} kcal/day
            </p>
          </div>
          <Link to="/progress" className="text-sm text-primary inline-flex items-center gap-1">
            View progress <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="h-56">
          <ResponsiveContainer>
            <AreaChart data={weekData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="cal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.19 255)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="oklch(0.62 0.19 255)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="kcal" stroke="oklch(0.62 0.19 255)" strokeWidth={2.5} fill="url(#cal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="glass-card lg:col-span-2 p-6 rounded-3xl border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Meals</h2>
            <Link to="/meals" className="text-sm text-primary">
              See all
            </Link>
          </div>
          <div className="divide-y divide-border/60">
            {todayMeals.length ? todayMeals.map((m) => (
              <div key={`${m.meal_type}-${m.food_name}`} className="flex items-center gap-4 py-3.5">
                <div className="h-11 w-11 rounded-2xl bg-accent flex items-center justify-center text-xl">
                  {MEAL_EMOJI[m.meal_type] || "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.food_name}</p>
                  <p className="text-xs text-muted-foreground">{formatMealType(m.meal_type)}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{m.calories || 0} kcal</span>
              </div>
            )) : (
              <p className="py-6 text-sm text-muted-foreground">No meals logged for today yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-0 text-white" style={{ background: "var(--gradient-hero)" }}>
          <p className="text-xs uppercase tracking-wider opacity-80">Weight</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-semibold">{dashboard?.weight || "N/A"}</span>
            <span className="opacity-80">kg</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{dashboard?.plan?.goal || "Keep tracking your progress"}</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {(weightHistory.length ? weightHistory : [{ label: "Now", weight: dashboard?.weight || "N/A" }]).map((item) => (
              <div key={`${item.label}-${item.weight}`} className="rounded-xl bg-white/15 backdrop-blur px-2 py-2">
                <p className="text-[10px] opacity-80">{item.label}</p>
                <p className="text-sm font-semibold">{item.weight}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        {motivationCards.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * index }}
          >
            <Card className="overflow-hidden rounded-3xl border-0">
              <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.quote}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value, sub, tint }) {
  return (
    <div className="rounded-2xl bg-accent/60 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground" style={{ color: tint }}>
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums">
        {value} <span className="text-xs font-normal text-muted-foreground">{sub}</span>
      </p>
    </div>
  );
}

function Macro({ icon, name, value, max, color, unit }) {
  const pct = max ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="inline-flex items-center gap-1.5" style={{ color }}>
          {icon}
          {name}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {value}/{max}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default Dashboard;
