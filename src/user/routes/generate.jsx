import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from "@/api/axios";
import { Dumbbell, Flame, HeartPulse, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { estimateNutrition, toDailyLogMealType } from "@/lib/nutrition-estimator";
import { getLocalDateYmd } from "@/lib/local-date";
import { getStoredUser, updateStoredUser } from "@/lib/auth-token";
import { getNotificationPrefsRequest } from "@/api/notifications";

const INITIAL_FORM = {
  weight: 72,
  height: 170,
  goal: "weight_loss",
  diet_type: "veg",
  plan_type: "daily",
  workout_type: "home",
  meal_preference: "north_indian",
  ai_prompt: "",
  pantry_mode: false,
  budget_tier: "standard",
  workout_focus: "balanced",
  injury_notes: "",
};

const GENERATE_GOALS = ["weight_loss", "maintenance", "muscle_gain"];

function valueOrDefault(value, fallback) {
  return value === undefined || value === null || value === "" ? fallback : value;
}

function normalizeGoal(goal) {
  if (goal === "fat_loss") return "weight_loss";
  return GENERATE_GOALS.includes(goal) ? goal : INITIAL_FORM.goal;
}

function normalizeDietType(dietType) {
  if (dietType === "non_veg") return "non veg";
  return ["veg", "veg_egg", "non veg"].includes(dietType) ? dietType : INITIAL_FORM.diet_type;
}

function buildInitialForm(user = getStoredUser()) {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const pantryMode = params?.get("pantry") === "1" || params?.get("pantry_mode") === "true";
  const requestedPlanType = params?.get("plan_type");

  return {
    ...INITIAL_FORM,
    weight: valueOrDefault(user?.weight, INITIAL_FORM.weight),
    height: valueOrDefault(user?.height, INITIAL_FORM.height),
    goal: normalizeGoal(user?.goal),
    diet_type: normalizeDietType(user?.diet_type),
    plan_type: requestedPlanType === "weekly" || requestedPlanType === "daily" ? requestedPlanType : INITIAL_FORM.plan_type,
    pantry_mode: pantryMode,
  };
}

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

const MEAL_SEQUENCE = [
  "morning_drink",
  "breakfast",
  "mid_morning_snack",
  "lunch",
  "evening_snack",
  "dinner",
  "after_dinner",
  "cheat_meal",
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

const LOGGABLE_MEAL_TYPES = [
  "morning_drink",
  "breakfast",
  "mid_morning_snack",
  "lunch",
  "evening_snack",
  "dinner",
  "after_dinner",
];

const NUTRITION_FIELDS = [
  ["energy", "Energy", "kcal"],
  ["protein", "Protein", "g"],
  ["carbs", "Carbs", "g"],
  ["fibre", "Fibre", "g"],
  ["sugar", "Sugar", "g"],
];

const WORKOUT_TYPE_OPTIONS = ["home", "gym", "cardio", "yoga", "mix"];

const WORKOUT_FOCUS_OPTIONS = [
  "balanced",
  "strength",
  "cardio",
  "yoga_mobility",
  "injury_safe",
  "weight_loss",
];

function formatMealType(type = "Meal") {
  if (MEAL_LABELS[type]) return MEAL_LABELS[type];

  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getMealOrder(mealType) {
  const index = MEAL_SEQUENCE.indexOf(mealType);
  return index === -1 ? MEAL_SEQUENCE.length : index;
}

function getMealNutrition(meal) {
  const estimated = estimateNutrition(meal.food_name, 250, meal.calories);
  const calories = Math.round(Number(meal.calories || meal.energy || estimated.calories || 0));

  return {
    calories,
    energy: Math.round(Number(meal.energy || calories)),
    protein: Math.round(Number(meal.protein || estimated.protein || 0)),
    carbs: Math.round(Number(meal.carbs || estimated.carbs || 0)),
    fibre: Math.round(Number(meal.fibre || meal.fiber || 0)),
    sugar: Math.round(Number(meal.sugar || 0)),
    fat: Math.round(Number(meal.fat || estimated.fat || 0)),
  };
}

function normalizeFoodName(foodName = "") {
  return foodName.trim().replace(/\s+/g, " ").toLowerCase();
}

function formatWorkoutText(value) {
  return String(value || "Not specified").replace(/_/g, " ");
}

function GeneratePage() {
  const { pathname } = useLocation();
  const isWorkoutPage = pathname === "/workout";
  const [form, setForm] = useState(() => buildInitialForm());
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loggingKey, setLoggingKey] = useState("");
  const [message, setMessage] = useState("");

  const groupedMeals = useMemo(() => {
    const generatedMeals = dashboard?.generated_meals || [];

    return generatedMeals.reduce((acc, meal) => {
      const day = meal.day || "Plan";
      acc[day] = acc[day] || [];
      acc[day].push(meal);
      acc[day].sort((a, b) => getMealOrder(a.meal_type) - getMealOrder(b.meal_type));
      return acc;
    }, {});
  }, [dashboard?.generated_meals]);

  const loggedMealKeys = useMemo(() => {
    const logs = dashboard?.meals || [];

    return new Set(
      logs.map((meal) => `${meal.meal_type}:${normalizeFoodName(meal.food_name)}`)
    );
  }, [dashboard?.meals]);

  const isMealLoggedToday = (meal) => {
    const mealType = toDailyLogMealType(meal.meal_type);
    return loggedMealKeys.has(`${mealType}:${normalizeFoodName(meal.food_name)}`);
  };

  const filteredWorkoutPlan = useMemo(() => {
    const plan = dashboard?.plan?.workout_plan || [];
    if (!plan.length) return [];

    if (form.plan_type === "daily") {
      return plan.slice(0, 1);
    }

    return plan.slice(0, 7);
  }, [dashboard?.plan?.workout_plan, form.plan_type]);

  const workoutPlan = dashboard?.plan?.workout_plan || [];

  async function loadDashboard() {
    const res = await API.get("/dashboard/show", { params: { date: getLocalDateYmd() } });
    setDashboard(res.data.data);
  }

  useEffect(() => {
    let ignore = false;

    async function fetchInitialData() {
      try {
        const requests = [
          API.get("/dashboard/show", { params: { date: getLocalDateYmd() } }),
          API.get("/user/me"),
        ];

        if (isWorkoutPage) {
          requests.push(getNotificationPrefsRequest());
        }

        const [dashboardRes, profileRes, notificationPrefs] = await Promise.all(requests);

        if (ignore) return;

        const user = profileRes.data?.data;
        setDashboard(dashboardRes.data.data);

        if (user) {
          updateStoredUser(user);
          setForm((prev) => ({
            ...prev,
            weight: valueOrDefault(user.weight, prev.weight),
            height: valueOrDefault(user.height, prev.height),
            goal: normalizeGoal(user.goal),
            diet_type: normalizeDietType(user.diet_type),
            ...(isWorkoutPage && notificationPrefs?.workout_plan_type
              ? { plan_type: notificationPrefs.workout_plan_type }
              : {}),
          }));
        }
      } catch {
        if (!ignore) setMessage("Unable to load generated meals right now.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchInitialData();

    return () => {
      ignore = true;
    };
  }, [isWorkoutPage]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setGenerating(true);
    setMessage("");

    try {
      const nextProfile = {
        weight: Number(form.weight),
        height: Number(form.height),
        goal: form.goal,
        diet_type: form.diet_type,
      };

      await API.post("/plan/generate-plan", {
        ...form,
        ...nextProfile,
      });
      updateStoredUser(nextProfile);
      await loadDashboard();
      setMessage(
        isWorkoutPage
          ? `${form.plan_type === "weekly" ? "Weekly" : "Daily"} workout plan generated successfully.`
          : "Customized meals generated successfully.",
      );
    } catch {
      setMessage(
        isWorkoutPage
          ? "Unable to generate workout plan right now."
          : "Unable to generate customized meals right now.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleLogGeneratedMeal = async (meal) => {
    const key = `${meal.day}-${meal.meal_type}-${meal.food_name}`;
    const nutrition = getMealNutrition(meal);

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
      await loadDashboard();
      setMessage(`${formatMealType(meal.meal_type)} logged for today.`);
    } catch {
      setMessage("Unable to log generated meal right now.");
    } finally {
      setLoggingKey("");
    }
  };

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          {isWorkoutPage ? <Dumbbell className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          {isWorkoutPage ? "AI workout coach" : "AI meal planner"}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">
          {isWorkoutPage ? "Workout Coach" : "Generate Customized Meals"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          {isWorkoutPage
            ? "Create home, gym, cardio, yoga and injury-aware workout plans. Choose daily or weekly to match your training schedule."
            : "Create a daily or weekly plan, then review every generated meal with nutrition here."}
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="glass-card lg:col-span-2 rounded-3xl p-6 border-0">
          <form onSubmit={handleGenerate} className="space-y-4">
            <Field label="Weight (kg)" value={form.weight} onChange={(value) => updateForm("weight", value)} type="number" />
            <Field label="Height (cm)" value={form.height} onChange={(value) => updateForm("height", value)} type="number" />
            <Select label="Generate For" value={form.plan_type} onChange={(value) => updateForm("plan_type", value)} options={["daily", "weekly"]} />
            {!isWorkoutPage ? (
              <>
                <Field
                  label="Meal request"
                  value={form.ai_prompt}
                  onChange={(value) => updateForm("ai_prompt", value)}
                  placeholder="e.g. high protein daily meals with paneer, no rice"
                />
                <Select label="Goal" value={form.goal} onChange={(value) => updateForm("goal", value)} options={["weight_loss", "maintenance", "muscle_gain"]} />
                <Select label="Diet Type" value={form.diet_type} onChange={(value) => updateForm("diet_type", value)} options={["veg", "veg_egg", "non veg"]} />
                <Select label="Meal Preference" value={form.meal_preference} onChange={(value) => updateForm("meal_preference", value)} options={["north_indian", "south_indian"]} />
              </>
            ) : (
              <>
                <Select label="Goal" value={form.goal} onChange={(value) => updateForm("goal", value)} options={["weight_loss", "maintenance", "muscle_gain"]} />
                <Field
                  label="Workout request"
                  value={form.ai_prompt}
                  onChange={(value) => updateForm("ai_prompt", value)}
                  placeholder="e.g. low impact knee-friendly home workouts, 30 min sessions"
                />
              </>
            )}
            <Select label="Workout Type" value={form.workout_type} onChange={(value) => updateForm("workout_type", value)} options={WORKOUT_TYPE_OPTIONS} />
            <Select label="Workout Focus" value={form.workout_focus} onChange={(value) => updateForm("workout_focus", value)} options={WORKOUT_FOCUS_OPTIONS} />
            <Field
              label="Injury / limitation notes"
              value={form.injury_notes}
              onChange={(value) => updateForm("injury_notes", value)}
              placeholder="e.g. knee pain, back pain, shoulder injury, beginner yoga"
            />
            {!isWorkoutPage ? (
              <>
                <Select label="Budget tier (₹/day)" value={form.budget_tier} onChange={(value) => updateForm("budget_tier", value)} options={["budget", "standard", "premium"]} />
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.pantry_mode}
                    onChange={(e) => updateForm("pantry_mode", e.target.checked)}
                    className="rounded border-input"
                  />
                  Pantry mode — use ingredients from <a href="/pantry" className="text-primary underline">your pantry</a>
                </label>
              </>
            ) : null}
            <Button type="submit" className="w-full rounded-xl" disabled={generating}>
              {generating ? "Generating..." : isWorkoutPage ? "Generate workout plan" : "Generate meals"}
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </form>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {isWorkoutPage ? (
            <Card className="glass-card rounded-3xl p-5 border-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                    <Dumbbell className="h-3.5 w-3.5" />
                    Workout coach
                  </p>
                  <h2 className="text-xl font-semibold mt-1">
                    {form.plan_type === "weekly" ? "Weekly Exercise Plan" : "Daily Exercise Plan"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {form.plan_type === "weekly"
                      ? "Your full week of home, gym, cardio, yoga and injury-aware workouts."
                      : "Today's focused workout from your latest generated plan."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded-2xl bg-muted px-3 py-2 text-xs font-semibold capitalize">
                    {form.plan_type}
                  </div>
                  <div className="rounded-2xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary capitalize">
                    {formatWorkoutText(form.workout_type)} · {formatWorkoutText(form.workout_focus)}
                  </div>
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">Loading workout plan...</p>
              ) : filteredWorkoutPlan.length ? (
                <div className="grid gap-3">
                  {filteredWorkoutPlan.map((workout) => (
                    <div key={`${workout.day}-${workout.type}-${workout.exercise}`} className="rounded-2xl bg-accent/50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-primary font-medium">{workout.day} · {formatWorkoutText(workout.type)}</p>
                          <h3 className="font-semibold mt-1 capitalize">{formatWorkoutText(workout.focus || form.workout_focus)} plan</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-semibold">
                            <Timer className="h-3.5 w-3.5" />
                            {workout.duration || 0} min
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-semibold">
                            <Flame className="h-3.5 w-3.5" />
                            {workout.calories_burned || 0} kcal
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <WorkoutLine icon={<HeartPulse className="h-4 w-4" />} label="Warmup" value={workout.warmup} />
                        <WorkoutLine icon={<Dumbbell className="h-4 w-4" />} label="Main workout" value={workout.exercise} />
                        <WorkoutLine icon={<ShieldCheck className="h-4 w-4" />} label="Yoga + balance" value={workout.yoga_balance} />
                        <WorkoutLine icon={<ShieldCheck className="h-4 w-4" />} label="Injury-safe note" value={workout.injury_notes} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generate a {form.plan_type} workout plan to see your exercise routine here. Add injury notes for safer modifications.
                </p>
              )}
            </Card>
          ) : (
            <>
          <Card className="glass-card rounded-3xl p-5 border-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                  <Dumbbell className="h-3.5 w-3.5" />
                  Workout coach
                </p>
                <h2 className="text-xl font-semibold mt-1">Exercise Plan</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Home, gym, cardio, yoga and injury-aware balance work from your latest generated plan.
                </p>
              </div>
              <div className="rounded-2xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary capitalize">
                {formatWorkoutText(form.workout_type)} · {formatWorkoutText(form.workout_focus)}
              </div>
            </div>

            {workoutPlan.length ? (
              <div className="grid gap-3">
                {workoutPlan.map((workout) => (
                  <div key={`${workout.day}-${workout.type}-${workout.exercise}`} className="rounded-2xl bg-accent/50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-primary font-medium">{workout.day} · {formatWorkoutText(workout.type)}</p>
                        <h3 className="font-semibold mt-1 capitalize">{formatWorkoutText(workout.focus || form.workout_focus)} plan</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-semibold">
                          <Timer className="h-3.5 w-3.5" />
                          {workout.duration || 0} min
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-semibold">
                          <Flame className="h-3.5 w-3.5" />
                          {workout.calories_burned || 0} kcal
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <WorkoutLine icon={<HeartPulse className="h-4 w-4" />} label="Warmup" value={workout.warmup} />
                      <WorkoutLine icon={<Dumbbell className="h-4 w-4" />} label="Main workout" value={workout.exercise} />
                      <WorkoutLine icon={<ShieldCheck className="h-4 w-4" />} label="Yoga + balance" value={workout.yoga_balance} />
                      <WorkoutLine icon={<ShieldCheck className="h-4 w-4" />} label="Injury-safe note" value={workout.injury_notes} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Generate a plan to see your exercise routine here. Add injury notes for safer modifications.
              </p>
            )}
          </Card>

          {loading ? (
            <Card className="glass-card rounded-3xl p-6 border-0">
              <p className="text-sm text-muted-foreground">Loading generated meals...</p>
            </Card>
          ) : Object.keys(groupedMeals).length ? (
            Object.entries(groupedMeals).map(([day, meals]) => (
              <Card key={day} className="glass-card rounded-3xl p-5 border-0">
                <h2 className="text-xl font-semibold mb-3">{day}</h2>
                <div className="space-y-3">
                  {meals.map((meal, index) => {
                    const nutrition = getMealNutrition(meal);
                    const canLogMeal = LOGGABLE_MEAL_TYPES.includes(meal.meal_type);
                    const alreadyLogged = isMealLoggedToday(meal);

                    return (
                    <div key={`${meal.meal_type}-${meal.food_name}`} className="rounded-2xl bg-accent/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-11 w-11 rounded-2xl bg-background flex items-center justify-center text-xl shrink-0">
                            {MEAL_EMOJI[meal.meal_type] || "🍽️"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-primary font-medium">
                              {String(index + 1).padStart(2, "0")} · {formatMealType(meal.meal_type)}
                            </p>
                            <h3 className="font-medium mt-1">{meal.food_name}</h3>
                          </div>
                        </div>
                        <p className="text-sm font-semibold tabular-nums inline-flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {nutrition.calories} kcal
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {NUTRITION_FIELDS.map(([key, label, unit]) => (
                          <div key={key} className="rounded-xl bg-background/80 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">{label}</p>
                            <p className="text-sm font-semibold tabular-nums">
                              {nutrition[key]} {unit}
                            </p>
                          </div>
                        ))}
                      </div>
                      {canLogMeal && !alreadyLogged ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full mt-3 rounded-xl"
                          onClick={() => handleLogGeneratedMeal(meal)}
                          disabled={loggingKey === `${meal.day}-${meal.meal_type}-${meal.food_name}`}
                        >
                          {loggingKey === `${meal.day}-${meal.meal_type}-${meal.food_name}` ? "Logging..." : `Log ${formatMealType(meal.meal_type)}`}
                        </Button>
                      ) : null}
                    </div>
                    );
                  })}
                </div>
              </Card>
            ))
          ) : (
            <Card className="glass-card rounded-3xl p-6 border-0">
              <p className="text-sm text-muted-foreground">No generated meal plan found yet. Generate one to show all meals here.</p>
            </Card>
          )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function WorkoutLine({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-background/80 px-3 py-2">
      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-relaxed">{value || "Coach will add this after generation."}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 rounded-xl"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatMealType(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GeneratePage;
