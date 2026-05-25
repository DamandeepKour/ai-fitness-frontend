import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock3, Flame, Beef, Wheat, Apple } from "lucide-react";
import API from "@/api/axios";
import { estimateNutrition, toDailyLogMealType } from "@/lib/nutrition-estimator";
import { getLocalDateYmd } from "@/lib/local-date";

const MEAL_EMOJI = {
  breakfast: "🥣",
  lunch: "🥗",
  dinner: "🍽️",
  mid_morning_snack: "🍌",
  evening_snack: "🍎",
  cheat_meal: "✨",
};

function formatMealType(type = "Meal") {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

  const targets = [
    { label: "Calories", value: `${total} / ${targetsFromApi.calories || 2200}kcal`, pct: Math.round((total / (targetsFromApi.calories || 2200)) * 100), color: "oklch(0.62 0.19 255)", icon: Flame },
    { label: "Protein", value: `${macros.protein || 0} / ${targetsFromApi.protein || 140}g`, pct: Math.round(((macros.protein || 0) / (targetsFromApi.protein || 140)) * 100), color: "oklch(0.7 0.2 25)", icon: Beef },
    { label: "Carbs", value: `${macros.carbs || 0} / ${targetsFromApi.carbs || 250}g`, pct: Math.round(((macros.carbs || 0) / (targetsFromApi.carbs || 250)) * 100), color: "oklch(0.78 0.16 75)", icon: Wheat },
    { label: "Fats", value: `${macros.fat || 0} / ${targetsFromApi.fat || 70}g`, pct: Math.round(((macros.fat || 0) / (targetsFromApi.fat || 70)) * 100), color: "oklch(0.7 0.17 145)", icon: Apple },
  ];

  // ✅ Filter out meals that have already been logged this session
  const visibleGeneratedMeals = generatedMeals.filter(
    (m) => !loggedKeys.has(`${m.day}-${m.meal_type}-${m.food_name}`)
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

      {/* ── Nutrition Breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5"
      >
        <Card className="glass-card rounded-3xl p-6 border-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-semibold">Nutrition Breakdown</h2>
              <p className="text-sm text-muted-foreground">Today's totals vs. daily targets</p>
            </div>
            <p className="text-4xl font-semibold tabular-nums">
              {total}
              <span className="text-3xl font-medium text-muted-foreground"> / 2200 kcal</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {targets.map((item) => (
              <div key={item.label} className="rounded-2xl bg-accent/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="inline-flex items-center gap-2 text-lg font-medium" style={{ color: item.color }}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </p>
                  <p className="text-2xl tabular-nums">{item.value}</p>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(item.pct, 100)}%`, background: item.color }} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{item.pct}% of target</p>
              </div>
            ))}
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
            {/* ✅ Wired up — logs meal and removes from generated list */}
            <Button
              variant="secondary"
              className="w-full mt-4 rounded-xl"
              onClick={() => handleLogMeal(m, "today")}
              disabled={loggingKey === `today-${m.meal_type}-${m.food_name}`}
            >
              <Plus className="h-4 w-4" />
              {loggingKey === `today-${m.meal_type}-${m.food_name}` ? "Logging..." : "Add to log"}
            </Button>
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
              {["breakfast", "lunch", "evening_snack", "dinner"].includes(m.meal_type) ? (
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