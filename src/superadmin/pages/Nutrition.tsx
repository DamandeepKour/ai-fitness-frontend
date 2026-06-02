import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
import { getNutritionAnalyticsRequest } from "@/api/nutrition";
import {
  Apple,
  Beef,
  Calendar,
  Flame,
  SkipForward,
  Target,
  Utensils,
} from "lucide-react";

type AnalyticsRow = { label: string; count: number };
type FoodRow = { name: string; logs: number; kcal: number };
type WeeklyRow = { day: string; score: number };
type NutritionAnalytics = {
  mealTypes: AnalyticsRow[];
  mealTotal: number;
  skippedMeals: AnalyticsRow[];
  skipTotal: number;
  topFoods: FoodRow[];
  weeklyAdherence: WeeklyRow[];
  avgAdherence: number;
  avgKcal: number;
  targetKcal: number;
  diff: number;
};

export default function SuperAdminNutritionPage() {
  const [data, setData] = useState<NutritionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Nutrition Analytics — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const analytics = await getNutritionAnalyticsRequest();
        if (!ignore) setData(analytics);
      } catch {
        if (!ignore) setError("Unable to load nutrition analytics.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const mealTypes = data?.mealTypes ?? [];
  const mealTotal = data?.mealTotal ?? 0;
  const skippedMeals = data?.skippedMeals ?? [];
  const skipTotal = data?.skipTotal ?? 0;
  const topFoods = data?.topFoods ?? [];
  const weeklyAdherence = data?.weeklyAdherence ?? [];
  const avgAdherence = data?.avgAdherence ?? 0;
  const avgKcal = data?.avgKcal ?? 0;
  const targetKcal = data?.targetKcal ?? 2000;
  const diff = data?.diff ?? 0;

  const mealRows = useMemo(
    () => mealTypes.map((r) => ({ ...r, total: mealTotal })),
    [mealTypes, mealTotal],
  );
  const skippedRows = useMemo(
    () => skippedMeals.map((r) => ({ ...r, total: skipTotal })),
    [skippedMeals, skipTotal],
  );

  return (
    <AdminShell>
      <PageHeader
        title="Nutrition Analytics"
        subtitle="What users eat, what they skip, and how closely they hit targets."
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Utensils}
          label="Meals logged (7d)"
          value={loading ? "..." : mealTotal}
          trend="last 7 days"
          tone="primary"
        />
        <StatCard
          icon={SkipForward}
          label="Skipped meals (7d)"
          value={loading ? "..." : skipTotal}
          trend={loading ? "..." : `${Math.round((skipTotal / (mealTotal || 1)) * 100)}% of logs`}
          tone="warning"
        />
        <StatCard
          icon={Flame}
          label="Avg kcal vs target"
          value={loading ? "..." : `${avgKcal}/${targetKcal}`}
          trend={
            loading
              ? "..."
              : diff >= 0
                ? `+${diff} kcal over`
                : `${Math.abs(diff)} kcal under`
          }
          tone={Math.abs(diff) > 200 ? "destructive" : "success"}
        />
        <StatCard
          icon={Target}
          label="Weekly adherence"
          value={loading ? "..." : avgAdherence}
          suffix={loading ? "" : "%"}
          trend="rolling 7-day avg"
          tone="accent"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BreakdownCard
          title="Most selected meal types"
          icon={Apple}
          rows={loading ? [] : mealRows}
          emptyLabel={loading ? "Loading..." : "No meal logs found"}
        />
        <BreakdownCard
          title="Most skipped meals"
          icon={SkipForward}
          rows={loading ? [] : skippedRows}
          emptyLabel={loading ? "Loading..." : "No skipped meals found"}
        />
        <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 grid place-items-center">
              <Calendar className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">Weekly adherence score</h3>
          </div>
          <div className="mt-6 flex items-end gap-2 h-40">
            {(loading ? [] : weeklyAdherence).map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted rounded-md overflow-hidden flex items-end h-32">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-success transition-all"
                    style={{ height: `${d.score}%` }}
                    title={`${d.score}%`}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
                <span className="text-xs font-semibold tabular-nums">{d.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-5">
          <Beef className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold">Top foods logged</h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Food</th>
                <th className="px-4 py-3 font-medium">Logs</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Kcal / serving</th>
                <th className="px-4 py-3 font-medium">Popularity</th>
              </tr>
            </thead>
            <tbody>
              {!loading && topFoods.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No food logs available yet.
                  </td>
                </tr>
              ) : (
                (loading ? [{ name: "Loading...", logs: 0, kcal: 0 }] : topFoods).map((f) => {
                  const max = (loading ? 1 : topFoods[0]?.logs || 1);
                  const w = Math.round((f.logs / max) * 100);
                  return (
                    <tr key={f.name} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{f.name}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {loading ? "..." : f.logs.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground hidden sm:table-cell">
                        {loading ? "..." : f.kcal}
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-2 w-40 max-w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${w}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
