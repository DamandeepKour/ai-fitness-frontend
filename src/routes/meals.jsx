import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const meals = [
  { name: "Avocado Toast & Eggs", kcal: 420, p: 22, c: 38, f: 20, emoji: "🥑", tag: "Breakfast" },
  { name: "Quinoa Chicken Bowl", kcal: 560, p: 42, c: 55, f: 16, emoji: "🥗", tag: "Lunch" },
  { name: "Greek Yogurt Parfait", kcal: 240, p: 18, c: 28, f: 6, emoji: "🍓", tag: "Snack" },
  { name: "Salmon, Rice & Greens", kcal: 620, p: 38, c: 60, f: 22, emoji: "🍣", tag: "Dinner" },
];

function MealsPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">AI-curated for your goals</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Today's Meals</h1>
      </header>
      <div className="grid sm:grid-cols-2 gap-5">
        {meals.map((m) => (
          <Card key={m.name} className="glass-card rounded-3xl p-5 border-0">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center text-3xl">{m.emoji}</div>
              <div className="flex-1">
                <p className="text-xs text-primary font-medium">{m.tag}</p>
                <h3 className="font-semibold text-lg leading-tight">{m.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{m.kcal} kcal</p>
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
