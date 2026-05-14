import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from "@/api/axios";
import { Flame, Sparkles } from "lucide-react";
import { estimateNutrition, toDailyLogMealType } from "@/lib/nutrition-estimator";
import { getLocalDateYmd } from "@/lib/local-date";

const INITIAL_FORM = {
  weight: 72,
  height: 170,
  goal: "weight_loss",
  diet_type: "veg",
  plan_type: "weekly",
  workout_type: "home",
  meal_preference: "north_indian",
  ai_prompt: "",
};

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

function GeneratePage() {
  const [form, setForm] = useState(INITIAL_FORM);
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
      return acc;
    }, {});
  }, [dashboard?.generated_meals]);

  async function loadDashboard() {
    const res = await API.get("/dashboard/show", { params: { date: getLocalDateYmd() } });
    setDashboard(res.data.data);
  }

  useEffect(() => {
    let ignore = false;

    async function fetchGeneratedMeals() {
      try {
        const res = await API.get("/dashboard/show", { params: { date: getLocalDateYmd() } });
        if (!ignore) setDashboard(res.data.data);
      } catch {
        if (!ignore) setMessage("Unable to load generated meals right now.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchGeneratedMeals();

    return () => {
      ignore = true;
    };
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setGenerating(true);
    setMessage("");

    try {
      await API.post("/plan/generate-plan", {
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
      });
      await loadDashboard();
      setMessage("Customized meals generated successfully.");
    } catch {
      setMessage("Unable to generate customized meals right now.");
    } finally {
      setGenerating(false);
    }
  };

  const handleLogGeneratedMeal = async (meal) => {
    const key = `${meal.day}-${meal.meal_type}-${meal.food_name}`;
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
          <Sparkles className="h-3.5 w-3.5" />
          AI meal planner
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Generate Customized Meals</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Create a weekly plan, then review every generated meal here.
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="glass-card lg:col-span-2 rounded-3xl p-6 border-0">
          <form onSubmit={handleGenerate} className="space-y-4">
            <Field label="Weight (kg)" value={form.weight} onChange={(value) => updateForm("weight", value)} type="number" />
            <Field label="Height (cm)" value={form.height} onChange={(value) => updateForm("height", value)} type="number" />
            <Select label="Generate For" value={form.plan_type} onChange={(value) => updateForm("plan_type", value)} options={["daily", "weekly"]} />
            <Field
              label="Meal request"
              value={form.ai_prompt}
              onChange={(value) => updateForm("ai_prompt", value)}
              placeholder="e.g. high protein daily meals with paneer, no rice"
            />
            <Select label="Goal" value={form.goal} onChange={(value) => updateForm("goal", value)} options={["weight_loss", "maintenance", "muscle_gain"]} />
            <Select label="Diet Type" value={form.diet_type} onChange={(value) => updateForm("diet_type", value)} options={["veg", "veg_egg", "non veg"]} />
            <Select label="Meal Preference" value={form.meal_preference} onChange={(value) => updateForm("meal_preference", value)} options={["north_indian", "south_indian"]} />
            <Select label="Workout Type" value={form.workout_type} onChange={(value) => updateForm("workout_type", value)} options={["home", "gym", "mix"]} />
            <Button type="submit" className="w-full rounded-xl" disabled={generating}>
              {generating ? "Generating..." : "Generate meals"}
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </form>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <Card className="glass-card rounded-3xl p-6 border-0">
              <p className="text-sm text-muted-foreground">Loading generated meals...</p>
            </Card>
          ) : Object.keys(groupedMeals).length ? (
            Object.entries(groupedMeals).map(([day, meals]) => (
              <Card key={day} className="glass-card rounded-3xl p-5 border-0">
                <h2 className="text-xl font-semibold mb-3">{day}</h2>
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div key={`${meal.meal_type}-${meal.food_name}`} className="rounded-2xl bg-accent/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-11 w-11 rounded-2xl bg-background flex items-center justify-center text-xl shrink-0">
                            {MEAL_EMOJI[meal.meal_type] || "🍽️"}
                          </div>
                          <div className="min-w-0">
                          <p className="text-xs text-primary font-medium">{formatMealType(meal.meal_type)}</p>
                          <h3 className="font-medium mt-1">{meal.food_name}</h3>
                          </div>
                        </div>
                        <p className="text-sm font-semibold tabular-nums inline-flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {meal.calories || 0} kcal
                        </p>
                      </div>
                      {["breakfast", "lunch", "evening_snack", "dinner"].includes(meal.meal_type) ? (
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
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <Card className="glass-card rounded-3xl p-6 border-0">
              <p className="text-sm text-muted-foreground">No generated meal plan found yet. Generate one to show all meals here.</p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
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
