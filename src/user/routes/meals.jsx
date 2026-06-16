import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock3, Flame } from "lucide-react";
import API from "@/api/axios";
import { estimateNutrition, toDailyLogMealType } from "@/lib/nutrition-estimator";
import { getLocalDateYmd } from "@/lib/local-date";

const MEAL_EMOJI = {
  morning_drink: "💧",
  breakfast: "🥣",
  lunch: "🥗",
  dinner: "🍽️",
  mid_morning_snack: "🍌",
  evening_snack: "🍎",
  after_dinner: "🍵",
  cheat_meal: "✨",
};

const LOGGABLE_MEAL_TYPES = [
  "morning_drink",
  "breakfast",
  "mid_morning_snack",
  "lunch",
  "evening_snack",
  "dinner",
  "after_dinner",
];

const MEAL_LABELS = {
  morning_drink: "Early Morning Drink",
  breakfast: "Breakfast",
  mid_morning_snack: "Mid Morning Snack",
  lunch: "Lunch",
  evening_snack: "Evening Snack",
  dinner: "Dinner",
  after_dinner: "After Dinner",
  cheat_meal: "Cheat Meal",
};

const CHANGE_STYLES = {
  up: {
    label: "More",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  down: {
    label: "Less",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  same: {
    label: "Same",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
};

function normalizeFoodName(foodName = "") {
  return foodName.trim().replace(/\s+/g, " ").toLowerCase();
}

function formatMealType(type = "Meal") {
  if (MEAL_LABELS[type]) return MEAL_LABELS[type];

  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getChangeState(today, previous) {
  if (today > previous) return "up";
  if (today < previous) return "down";
  return "same";
}

function formatSignedChange(today, previous, unit) {
  const diff = Math.round(today - previous);
  if (diff === 0) return `0${unit}`;
  return `${diff > 0 ? "+" : ""}${diff}${unit}`;
}

function MealsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingKey, setLoggingKey] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Track which generated meals have been logged — persists across refreshDashboard()
  const [loggedKeys, setLoggedKeys] = useState(new Set());

  const meals = dashboard?.meals || [];
  const generatedMeals = dashboard?.generated_meals || [];
  const total = dashboard?.today?.consumed_calories ?? meals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
  const targetsFromApi = dashboard?.targets || {};
  const macros = dashboard?.today?.macros || {};
  const previous = dashboard?.yesterday || {};
  const previousMacros = previous.macros || {};
  const loggedMealKeys = new Set(
    meals.map((m) => `${m.meal_type}:${normalizeFoodName(m.food_name)}`)
  );

  const nutritionRows = [
    {
      label: "Energy",
      today: total,
      previous: previous.consumed_calories || 0,
      target: targetsFromApi.calories || 2200,
      unit: "kcal",
    },
    {
      label: "Protein",
      today: macros.protein || 0,
      previous: previousMacros.protein || 0,
      target: targetsFromApi.protein || 140,
      unit: "g",
    },
    {
      label: "Carbohydrate",
      today: macros.carbs || 0,
      previous: previousMacros.carbs || 0,
      target: targetsFromApi.carbs || 250,
      unit: "g",
    },
    {
      label: "Total Fat",
      today: macros.fat || 0,
      previous: previousMacros.fat || 0,
      target: targetsFromApi.fat || 70,
      unit: "g",
    },
  ];

  // Hide generated meals that are already logged today, including after refresh.
  const visibleGeneratedMeals = generatedMeals.filter(
    (m) => {
      const mealType = toDailyLogMealType(m.meal_type);
      const loggedToday = loggedMealKeys.has(`${mealType}:${normalizeFoodName(m.food_name)}`);
      const loggedThisSession = loggedKeys.has(`${m.day}-${m.meal_type}-${m.food_name}`);
      return !loggedToday && !loggedThisSession;
    }
  );

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const res = await API.get("/dashboard/show", { params: { date: getLocalDateYmd() } });
        if (!ignore) setDashboard(res.data.data);
      } catch {
        if (!ignore) setError("Unable to load meals right now.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshDashboard = async () => {
    const res = await API.get("/dashboard/show", { params: { date: getLocalDateYmd() } });
    setDashboard(res.data.data);
  };

  // ✅ Unified log handler — works for both generated meals and today's meals
  const handleLogMeal = async (meal, dayOverride) => {
    const day = dayOverride ?? meal.day;
    const key = `${day}-${meal.meal_type}-${meal.food_name}`;
    const nutrition = estimateNutrition(meal.food_name, 250, meal.calories);

    setLoggingKey(key);
    setMessage("");

    try {
      await API.post("/daily-log/add", {
        log_date: getLocalDateYmd(),
        meal_type: toDailyLogMealType(meal.meal_type),
        food_name: meal.food_name,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
      });
      await refreshDashboard();
      // ✅ Add to logged set so it disappears from generated meals list
      setLoggedKeys((prev) => new Set([...prev, key]));
      setMessage(`${formatMealType(meal.meal_type)} logged for today.`);
    } catch {
      setMessage("Unable to log meal right now.");
    } finally {
      setLoggingKey("");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Loading meals...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">AI-curated for your goals</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Today's Meals</h1>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
        {message ? <p className="mt-2 text-sm text-muted-foreground">{message}</p> : null}
      </header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5"
      >
        <Card className="glass-card rounded-3xl p-0 border-0 overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-foreground px-4 py-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Daily Nutrition</p>
              <h2 className="text-xl font-black leading-none mt-1">Nutrition Facts</h2>
              <p className="text-sm text-muted-foreground mt-2">Today compared with previous day</p>
            </div>
            <div className="rounded-2xl bg-foreground px-4 py-3 text-background text-right">
              <p className="text-xs opacity-80">Energy today</p>
              <p className="text-xl font-black tabular-nums">{total}<span className="text-base font-semibold"> kcal</span></p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] border-b border-border bg-accent/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Nutrient</span>
                <span className="text-right">Today</span>
                <span className="text-right">Previous</span>
                <span className="text-right">Change</span>
              </div>
              {nutritionRows.map((row) => {
                const state = getChangeState(row.today, row.previous);
                const style = CHANGE_STYLES[state];
                const pct = Math.round((row.today / Math.max(row.target, 1)) * 100);

                return (
                  <div key={row.label} className="grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center border-b border-border/70 px-4 py-2 last:border-b-0">
                    <div>
                      <p className="font-black">{row.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{pct}% of daily target</p>
                    </div>
                    <p className="text-right text-lg font-black tabular-nums">
                      {Math.round(row.today)}<span className="ml-1 text-xs font-semibold text-muted-foreground">{row.unit}</span>
                    </p>
                    <p className="text-right text-sm font-semibold tabular-nums text-muted-foreground">
                      {Math.round(row.previous)} {row.unit}
                    </p>
                    <div className="flex justify-end">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${style.bg} ${style.border} ${style.text}`}>
                        {formatSignedChange(row.today, row.previous, row.unit)} · {style.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { label: "Green", text: "More than previous day", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                { label: "Red", text: "Less than previous day", className: "bg-rose-50 text-rose-700 border-rose-200" },
                { label: "Blue", text: "Same as previous day", className: "bg-blue-50 text-blue-700 border-blue-200" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border px-3 py-2 text-xs ${item.className}`}>
                  <span className="font-bold">{item.label}:</span> {item.text}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Today's Logged Meals ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        {meals.length ? meals.map((m) => (
          <Card key={`${m.meal_type}-${m.food_name}`} className="glass-card rounded-3xl p-5 border-0">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center text-3xl">
                {MEAL_EMOJI[m.meal_type] || "🍽️"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-primary font-medium">{formatMealType(m.meal_type)}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    Today
                  </p>
                </div>
                <h3 className="font-semibold text-lg leading-tight">{m.food_name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                  <Flame className="h-4 w-4" /> {m.calories || 0} kcal
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Macro label="P" value={m.protein || 0} color="oklch(0.7 0.2 25)" />
              <Macro label="C" value={m.carbs || 0} color="oklch(0.78 0.16 75)" />
              <Macro label="F" value={m.fat || 0} color="oklch(0.7 0.17 145)" />
            </div>
          </Card>
        )) : (
          <Card className="glass-card rounded-3xl p-6 border-0 sm:col-span-2">
            <p className="text-sm text-muted-foreground">No meals logged for today yet.</p>
          </Card>
        )}
      </div>

      {/* ── Generated Customized Meals ── */}
      <Card className="glass-card rounded-3xl p-6 border-0 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold">Generated Customized Meals</h2>
            <p className="text-sm text-muted-foreground">Latest meals from your generated plan.</p>
          </div>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link to="/generate">View all</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {/* ✅ Uses visibleGeneratedMeals — logged meals are excluded */}
          {visibleGeneratedMeals.slice(0, 6).map((m) => (
            <div key={`${m.day}-${m.meal_type}-${m.food_name}`} className="rounded-2xl bg-accent/50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl bg-background flex items-center justify-center text-xl shrink-0">
                  {MEAL_EMOJI[m.meal_type] || "🍽️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary font-medium">
                    {m.day} · {formatMealType(m.meal_type)}
                  </p>
                  <h3 className="font-medium mt-1">{m.food_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.calories || 0} kcal</p>
                </div>
              </div>
              {LOGGABLE_MEAL_TYPES.includes(m.meal_type) ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full mt-3 rounded-xl"
                  onClick={() => handleLogMeal(m)}
                  disabled={loggingKey === `${m.day}-${m.meal_type}-${m.food_name}`}
                >
                  <Plus className="h-4 w-4" />
                  {loggingKey === `${m.day}-${m.meal_type}-${m.food_name}`
                    ? "Logging..."
                    : `Log ${formatMealType(m.meal_type)}`}
                </Button>
              ) : null}
            </div>
          ))}
          {/* ✅ Empty state accounts for all meals being logged */}
          {!visibleGeneratedMeals.length ? (
            <p className="text-sm text-muted-foreground md:col-span-2">
              {generatedMeals.length
                ? "All generated meals have been logged for today. 🎉"
                : "No generated meal plan found yet."}
            </p>
          ) : null}
        </div>
      </Card>
    </AppShell>
  );
}

function Macro({ label, value, color }) {
  return (
    <div className="rounded-xl bg-accent/60 py-2">
      <p className="text-[11px]" style={{ color }}>
        {label}
      </p>
      <p className="text-sm font-semibold tabular-nums">{value}g</p>
    </div>
  );
}

export default MealsPage;