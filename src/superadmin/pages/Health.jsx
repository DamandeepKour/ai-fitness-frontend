import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { PageHeader, ReasonBadge, StatCard } from "@/components/admin/shared";
import { getHealthAnalyticsRequest } from "@/api/health";
import {
  AlertOctagon,
  Beef,
  Calendar,
  Flame,
  HeartPulse,
  Scale,
  Timer,
  Utensils,
} from "lucide-react";

const REASON_ICONS = {
  adherence: HeartPulse,
  logging: Calendar,
  calories: Flame,
  protein: Beef,
  breakfast: Utensils,
  timeline: Timer,
};

function reasonLabel(key, reasons) {
  return reasons.find((r) => r.key === key)?.title ?? key;
}

export default function SuperAdminHealthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Weight-loss Reasons — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const analytics = await getHealthAnalyticsRequest();
        if (!ignore) setData(analytics);
      } catch {
        if (!ignore) setError("Unable to load health analytics.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const stagnant = data?.stagnant ?? 0;
  const totalActive = data?.totalActive ?? 0;
  const stagnantPct = data?.stagnantPct ?? 0;
  const reasons = data?.reasons ?? [];
  const stagnantUsers = data?.stagnantUsers ?? [];

  const topCauseTitle = useMemo(
    () => data?.topCause?.title ?? reasons[0]?.title ?? "—",
    [data?.topCause?.title, reasons],
  );

  return (
    <AdminShell>
      <PageHeader
        title="Weight-loss Reasons"
        subtitle='High-level diagnosis for "users are not losing weight" — grouped by root cause.'
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Scale}
          label="Users not losing weight"
          value={loading ? "..." : stagnant}
          trend={`${stagnantPct}% of active users`}
          tone="destructive"
        />
        <StatCard
          icon={AlertOctagon}
          label="Avg root causes / user"
          value={loading ? "..." : data?.avgRootCauses ?? 0}
          trend="multiple factors stack up"
          tone="warning"
        />
        <StatCard
          icon={HeartPulse}
          label="Top cause"
          value={loading ? "..." : topCauseTitle}
          trend={
            loading
              ? "..."
              : `${(data?.topCause?.affected ?? 0).toLocaleString()} users`
          }
          tone="primary"
        />
        <StatCard
          icon={Flame}
          label="Calorie overshoot rate"
          value={loading ? "..." : data?.calorieOvershootRate ?? 0}
          suffix="%"
          trend="of stagnant users"
          tone="accent"
        />
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3 text-slate-900">Root-cause breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(loading ? [] : reasons).map((r) => {
            const Icon = REASON_ICONS[r.key] || HeartPulse;
            const pct = stagnant ? Math.round((r.affected / stagnant) * 100) : 0;
            return (
              <Card key={r.key} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl grid place-items-center ${
                      r.severity === "destructive"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{r.title}</h3>
                      <ReasonBadge tone={r.severity}>{pct}%</ReasonBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.hint}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="text-2xl font-semibold tabular-nums">
                    {r.affected.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">affected users</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      r.severity === "destructive" ? "bg-red-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold text-slate-900">
            Stagnant users — diagnostic view
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Users with little or no progress in the last few weeks, mapped to their most likely
          causes.
        </p>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Weeks stagnant</th>
                <th className="px-4 py-3 font-medium">Δ kg</th>
                <th className="px-4 py-3 font-medium">Likely causes</th>
              </tr>
            </thead>
            <tbody>
              {!loading && stagnantUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No stagnant users detected yet.
                  </td>
                </tr>
              ) : (
                (loading
                  ? [{ id: "loading", name: "Loading...", weeks: 0, lossKg: 0, reasons: [] }]
                  : stagnantUsers
                ).map((u) => (
                  <tr key={u.id || u.name} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 tabular-nums">{u.weeks}</td>
                    <td
                      className={`px-4 py-3 tabular-nums ${
                        u.lossKg <= 0 ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {u.lossKg > 0 ? "+" : ""}
                      {Number(u.lossKg).toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {u.reasons.map((k) => (
                          <ReasonBadge key={k} tone="warning">
                            {reasonLabel(k, reasons)}
                          </ReasonBadge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
