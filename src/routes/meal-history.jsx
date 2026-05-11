import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, Clock3, Flame, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMealHistoryForFilter, formatHistoryDayTitle } from "@/data/mealHistory7d";

const FILTERS = [
  { id: "today", label: "Today" },
  { id: "7days", label: "7 days" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
];

const FILTER_BLURB = {
  today: "Entries for today only.",
  "7days": "The last seven days including today, newest first.",
  this_month: "From the first of this month through today.",
  last_month: "The full previous calendar month.",
};

const MEAL_VISUAL = {
  Breakfast: {
    emoji: "🌤️",
    bar: "bg-gradient-to-b from-amber-400 to-orange-500",
    chip: "bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/25",
  },
  Lunch: {
    emoji: "🥗",
    bar: "bg-gradient-to-b from-emerald-400 to-teal-600",
    chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/25",
  },
  Snack: {
    emoji: "✨",
    bar: "bg-gradient-to-b from-pink-400 to-rose-500",
    chip: "bg-pink-500/15 text-pink-800 dark:text-pink-300 ring-1 ring-pink-500/25",
  },
  Dinner: {
    emoji: "🌙",
    bar: "bg-gradient-to-b from-violet-400 to-indigo-600",
    chip: "bg-violet-500/15 text-violet-800 dark:text-violet-300 ring-1 ring-violet-500/25",
  },
};

const DEFAULT_MEAL_VISUAL = {
  emoji: "🍽️",
  bar: "bg-gradient-to-b from-slate-400 to-slate-600",
  chip: "bg-muted text-muted-foreground ring-1 ring-border",
};

const DAY_BACKDROPS = [
  "from-amber-500/20 via-orange-400/10 to-rose-500/15",
  "from-sky-500/20 via-cyan-400/10 to-teal-500/15",
  "from-violet-500/20 via-fuchsia-400/10 to-pink-500/15",
  "from-lime-500/15 via-emerald-400/10 to-cyan-500/15",
  "from-orange-500/20 via-amber-300/10 to-yellow-500/15",
];

function mealVisual(tag) {
  return MEAL_VISUAL[tag] ?? DEFAULT_MEAL_VISUAL;
}

function dayBackdropClass(date) {
  const key = Math.floor(new Date(date).getTime() / 86400000);
  return DAY_BACKDROPS[Math.abs(key) % DAY_BACKDROPS.length];
}

function MealHistoryPage() {
  const [filter, setFilter] = useState("7days");
  const days = useMemo(() => getMealHistoryForFilter(filter), [filter]);

  return (
    <AppShell>
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" className="-ml-2 mb-2 rounded-xl text-muted-foreground" asChild>
            <Link to="/profile" className="inline-flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Profile
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" />
            Meal log
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-1">Meal history</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">{FILTER_BLURB[filter]}</p>
        </div>
      </header>

      <div className="mb-5 -mx-1 px-1 overflow-x-auto pb-1">
        <div className="flex gap-2 min-w-min sm:flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              type="button"
              variant={filter === f.id ? "default" : "secondary"}
              size="sm"
              className={cn(
                "rounded-full shrink-0 px-4",
                filter === f.id ? "shadow-sm" : "text-muted-foreground",
              )}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 -mr-1"
      >
        <div className="space-y-4 pb-8">
          {days.map((day) => (
            <DayMealStack key={day.date.toISOString()} day={day} />
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}

function DayMealStack({ day }) {
  const multi = day.meals.length > 1;
  const backdrop = dayBackdropClass(day.date);

  const summaryInner = (
    <div
      className={cn(
        "relative flex flex-1 items-center gap-3 sm:gap-4 min-w-0 rounded-2xl px-4 py-3.5 sm:px-5 overflow-hidden",
        multi && "pr-12 sm:pr-14",
        "bg-gradient-to-br",
        backdrop,
      )}
    >
      <div className="absolute inset-0 bg-card/55 dark:bg-card/40 backdrop-blur-[2px] pointer-events-none" />
      <div className="relative flex items-center gap-1.5 shrink-0">
        {day.meals.slice(0, 4).map((m, i) => {
          const v = mealVisual(m.tag);
          return (
            <span
              key={`${m.tag}-${i}`}
              className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl text-xl sm:text-2xl shadow-inner ring-2 ring-background/80 bg-background/90"
              title={m.tag}
            >
              {v.emoji}
            </span>
          );
        })}
        {day.meals.length > 4 ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold bg-muted text-muted-foreground ring-2 ring-background/80">
            +{day.meals.length - 4}
          </span>
        ) : null}
      </div>
      <div className="relative flex-1 min-w-0 text-left">
        <h2 className="text-base sm:text-lg font-semibold leading-tight">{formatHistoryDayTitle(day.date)}</h2>
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
          {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(day.date)}
        </p>
        {day.meals.length === 1 ? (
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 inline-flex items-center gap-1.5">
            <span className="text-base leading-none">{mealVisual(day.meals[0].tag).emoji}</span>
            {day.meals[0].tag} · {day.meals[0].time}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {day.meals.map((m) => (
              <span
                key={`pill-${m.tag}-${m.time}`}
                className={cn("text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full", mealVisual(m.tag).chip)}
              >
                {mealVisual(m.tag).emoji} {m.tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="relative shrink-0 flex flex-col items-end gap-1">
        <p className="text-sm font-semibold tabular-nums inline-flex items-center gap-1 text-primary">
          <Flame className="h-4 w-4" />
          {day.totalKcal}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium">
          {day.meals.length} meal{day.meals.length === 1 ? "" : "s"}
        </p>
        {multi ? (
          <span className="text-[10px] text-primary/90 font-medium hidden sm:inline">Open for details</span>
        ) : null}
      </div>
    </div>
  );

  const mealList = (
    <ul className="divide-y divide-border/50 bg-card/30">
      {day.meals.map((m) => {
        const v = mealVisual(m.tag);
        return (
          <li key={`${m.tag}-${m.time}-${m.name}`} className="flex gap-0">
            <div className={cn("w-1.5 shrink-0 rounded-full my-3 ml-3 self-stretch", v.bar)} aria-hidden />
            <div className="flex flex-1 gap-3 px-4 py-3.5 sm:px-5 min-w-0">
              <span className="text-2xl shrink-0 pt-0.5" aria-hidden>
                {v.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{m.tag}</p>
                <p className="font-medium leading-snug mt-0.5">{m.name}</p>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5 shrink-0" />
                  {m.time}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums shrink-0 text-foreground">{m.kcal} kcal</p>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Card className="glass-card rounded-3xl border border-border/40 overflow-hidden shadow-sm">
      {multi ? (
        <details className="group">
          <summary
            className={cn(
              "list-none cursor-pointer select-none",
              "[&::-webkit-details-marker]:hidden [&::marker]:content-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
            )}
          >
            <div className="relative">
              {summaryInner}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 border border-border/60 shadow-sm transition-transform duration-200 group-open:rotate-180">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </summary>
          {mealList}
        </details>
      ) : (
        <>
          <div className="p-1">{summaryInner}</div>
          {mealList}
        </>
      )}
    </Card>
  );
}

export default MealHistoryPage;
