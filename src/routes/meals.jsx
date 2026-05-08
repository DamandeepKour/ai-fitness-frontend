import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock3, Flame, Beef, Wheat, Apple } from "lucide-react";

const meals = [
  { name: "Avocado Toast & Eggs", kcal: 420, p: 22, c: 38, f: 20, emoji: "🥑", tag: "Breakfast" },
  { name: "Quinoa Chicken Bowl", kcal: 560, p: 42, c: 55, f: 16, emoji: "🥗", tag: "Lunch" },
  { name: "Greek Yogurt Parfait", kcal: 240, p: 18, c: 28, f: 6, emoji: "🍓", tag: "Snack" },
  { name: "Salmon, Rice & Greens", kcal: 620, p: 38, c: 60, f: 22, emoji: "🍣", tag: "Dinner" },
];

function MealsPage() {
  const total = meals.reduce((acc, meal) => acc + meal.kcal, 0);
  const targets = [
    { label: "Calories", value: `${total} / 2200kcal`, pct: Math.round((total / 2200) * 100), color: "oklch(0.62 0.19 255)", icon: Flame },
    { label: "Protein", value: "120 / 140g", pct: 86, color: "oklch(0.7 0.2 25)", icon: Beef },
    { label: "Carbs", value: "181 / 250g", pct: 72, color: "oklch(0.78 0.16 75)", icon: Wheat },
    { label: "Fats", value: "64 / 70g", pct: 91, color: "oklch(0.7 0.17 145)", icon: Apple },
  ];

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">AI-curated for your goals</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Today's Meals</h1>
      </header>

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
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{item.pct}% of target</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5">
        {meals.map((m) => (
          <Card key={m.name} className="glass-card rounded-3xl p-5 border-0">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center text-3xl">{m.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-primary font-medium">{m.tag}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {m.tag === "Breakfast"
                      ? "8:00 AM"
                      : m.tag === "Lunch"
                        ? "1:00 PM"
                        : m.tag === "Snack"
                          ? "4:30 PM"
                          : "7:30 PM"}
                  </p>
                </div>
                <h3 className="font-semibold text-lg leading-tight">{m.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                  <Flame className="h-4 w-4" /> {m.kcal} kcal
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Macro label="P" value={m.p} color="oklch(0.7 0.2 25)" />
              <Macro label="C" value={m.c} color="oklch(0.78 0.16 75)" />
              <Macro label="F" value={m.f} color="oklch(0.7 0.17 145)" />
            </div>
            <Button variant="secondary" className="w-full mt-4 rounded-xl">
              <Plus className="h-4 w-4" /> Add to log
            </Button>
          </Card>
        ))}
      </div>
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
