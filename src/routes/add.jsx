import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Flame, Salad, Dumbbell } from "lucide-react";

const TABLE = {
  chicken: 1.65,
  rice: 1.3,
  egg: 1.55,
  salad: 0.4,
  banana: 0.89,
  oats: 3.8,
  salmon: 2.08,
  bread: 2.65,
  avocado: 1.6,
  yogurt: 0.6,
  almonds: 5.79,
  pasta: 1.31,
  beef: 2.5,
  tofu: 1.45,
  cheese: 4.0,
};

function estimate(food, grams) {
  const key = Object.keys(TABLE).find((k) => food.toLowerCase().includes(k));
  const factor = key ? TABLE[key] : 1.5;
  return Math.round(factor * grams);
}

function AddPage() {
  const [food, setFood] = useState("Grilled chicken with rice");
  const [grams, setGrams] = useState(250);
  const [meal, setMeal] = useState("Lunch");

  const kcal = useMemo(() => estimate(food, grams), [food, grams]);
  const protein = Math.round(grams * 0.18);
  const carbs = Math.round(grams * 0.22);
  const fat = Math.round(grams * 0.06);

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">AI-powered estimation</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Log Food</h1>
      </header>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5"
      >
        <Card className="rounded-3xl border-0 overflow-hidden text-white">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1600&q=80"
              alt="Healthy ingredients and workout lifestyle"
              className="h-52 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/35" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p className="inline-flex w-fit items-center gap-1.5 text-xs bg-white/20 rounded-full px-2.5 py-1">
                <Sparkles className="h-3 w-3" /> Smart nutrition
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-3">Fuel your body with better choices.</h2>
              <p className="text-sm text-white/90 mt-2">
                Log meals quickly and keep your fitness routine aligned with your food plan.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="glass-card lg:col-span-3 rounded-3xl p-6 border-0 space-y-5">
          <div>
            <Label className="text-xs text-muted-foreground">Meal</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMeal(m)}
                  className={`rounded-xl py-2 text-sm font-medium transition-colors ${meal === m ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="food" className="text-xs text-muted-foreground">
              What did you eat?
            </Label>
            <Input
              id="food"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="mt-2 h-12 rounded-xl"
              placeholder="e.g. Avocado toast with egg"
            />
          </div>
          <div>
            <Label htmlFor="g" className="text-xs text-muted-foreground">
              Portion (grams)
            </Label>
            <Input
              id="g"
              type="number"
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value) || 0)}
              className="mt-2 h-12 rounded-xl"
            />
            <input
              type="range"
              min={20}
              max={800}
              step={10}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="w-full mt-3 accent-[var(--primary)]"
            />
          </div>
          <Button size="lg" className="w-full rounded-xl">
            Add to today
          </Button>
        </Card>

        <Card className="lg:col-span-2 rounded-3xl p-6 border-0 text-white" style={{ background: "var(--gradient-hero)" }}>
          <div className="inline-flex items-center gap-1.5 text-xs bg-white/20 rounded-full px-2.5 py-1">
            <Sparkles className="h-3 w-3" /> AI estimate
          </div>
          <div className="flex items-baseline gap-2 mt-5">
            <Flame className="h-7 w-7" />
            <span className="text-5xl font-semibold tabular-nums">{kcal}</span>
            <span className="opacity-80">kcal</span>
          </div>
          <p className="text-sm opacity-90 mt-2 capitalize">
            {meal} · {grams}g · {food}
          </p>
          <div className="grid grid-cols-3 gap-2 mt-6">
            <Pill label="Protein" value={`${protein}g`} />
            <Pill label="Carbs" value={`${carbs}g`} />
            <Pill label="Fats" value={`${fat}g`} />
          </div>
          <p className="text-xs opacity-80 mt-6 leading-relaxed">
            Estimates are based on common nutritional ranges. Confirm portion size for best accuracy.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/15 px-3 py-2 text-sm inline-flex items-center gap-2">
              <Salad className="h-4 w-4" /> Eat colorful whole foods
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2 text-sm inline-flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> Pair meals with movement
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Pill({ label, value }) {
  return (
    <div className="rounded-xl bg-white/15 backdrop-blur px-3 py-2">
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

export default AddPage;
