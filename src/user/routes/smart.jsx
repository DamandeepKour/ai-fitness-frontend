import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getBudgetTiersRequest,
  getCoachingRequest,
  getSwapSuggestionsRequest,
  swapMealRequest,
} from "@/api/pantry";
import {
  ArrowRight,
  ChefHat,
  IndianRupee,
  Languages,
  RefreshCw,
  Sparkles,
  Warehouse,
} from "lucide-react";

export default function SmartFeaturesPage() {
  const [coaching, setCoaching] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [budgetTiers, setBudgetTiers] = useState({});
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Smart Features — AIFitnova";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const [coachData, swapData, tiers] = await Promise.all([
          getCoachingRequest(),
          getSwapSuggestionsRequest(),
          getBudgetTiersRequest(),
        ]);
        if (ignore) return;
        setCoaching(coachData);
        setSwaps(swapData?.suggestions ?? []);
        setBudgetTiers(tiers);
      } catch {
        if (!ignore) setMessage("Some features could not load.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSwap(suggestion) {
    const key = `${suggestion.day}-${suggestion.mealType}`;
    setSwapping(key);
    setMessage("");
    try {
      const result = await swapMealRequest({
        mealType: suggestion.mealType,
        currentFood: suggestion.currentFood,
        day: suggestion.day,
      });
      setMessage(result.message || `Swapped to ${result.swap?.name}`);
    } catch {
      setMessage("Swap failed. Try again.");
    } finally {
      setSwapping("");
    }
  }

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          India-first intelligence
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Smart Features</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Indian food swaps, pantry mode, budget plans, and Hindi + English coaching — built for how India actually eats.
        </p>
      </header>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <FeatureCard
          to="/pantry"
          icon={Warehouse}
          title="Pantry mode"
          desc="Generate meals from what's already in your kitchen"
        />
        <FeatureCard
          to="/generate"
          icon={IndianRupee}
          title="Budget plans"
          desc="₹150–400/day tiers when generating meals"
        />
        <FeatureCard
          to="/premium"
          icon={Sparkles}
          title="Premium"
          desc="Coach review, family, WhatsApp, labs, wearables"
        />
        <FeatureCard
          to="/generate"
          icon={ChefHat}
          title="Food swap engine"
          desc="Regional Indian alternatives below"
        />
      </section>

      <Card className="glass-card rounded-3xl p-6 border-0 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Vernacular coaching</h2>
          <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">Hindi + English</span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading coaching...</p>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
            {coaching?.coaching || "Set your language in Profile for personalized Hindi/English tips."}
          </p>
        )}
        {coaching?.pantryAware ? (
          <p className="text-xs text-emerald-600 mt-3">Pantry-aware coaching active</p>
        ) : null}
      </Card>

      <Card className="glass-card rounded-3xl p-6 border-0 mb-6">
        <h2 className="text-lg font-semibold mb-1">Budget plan tiers</h2>
        <p className="text-sm text-muted-foreground mb-4">Select a tier on the Generate page when creating your plan.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {Object.entries(budgetTiers).map(([key, tier]) => (
            <div key={key} className="rounded-2xl border border-border bg-accent/30 p-4">
              <p className="font-semibold">{tier.label}</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">₹{tier.daily_inr}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
              <p className="text-xs text-muted-foreground mt-2">{tier.hint}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-card rounded-3xl p-6 border-0">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Indian food swap engine</h2>
            <p className="text-sm text-muted-foreground">Smarter regional swaps for your current meal plan</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/generate">Generate plan</Link>
          </Button>
        </div>

        {message ? <p className="text-sm text-primary mb-4">{message}</p> : null}

        {!loading && swaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">Generate a meal plan first to see swap suggestions.</p>
        ) : (
          <div className="space-y-3">
            {(loading ? [] : swaps).map((s) => (
              <div key={`${s.day}-${s.mealType}`} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.day} · {s.mealType.replace(/_/g, " ")}</p>
                    <p className="font-medium mt-0.5">{s.currentFood}</p>
                    <p className="text-sm text-emerald-700 mt-1">
                      → {s.topSwap?.name} · {s.topSwap?.reason}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ~₹{s.topSwap?.cost_inr}/serving · {s.topSwap?.protein_g}g protein
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={swapping === `${s.day}-${s.mealType}`}
                    onClick={() => handleSwap(s)}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    {swapping === `${s.day}-${s.mealType}` ? "Swapping..." : "Apply swap"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}

function FeatureCard({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="group">
      <Card className="glass-card h-full rounded-3xl p-5 border-0 transition hover:shadow-md">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold mt-3">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        <span className="inline-flex items-center gap-1 text-xs text-primary mt-3 group-hover:underline">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </Card>
    </Link>
  );
}
