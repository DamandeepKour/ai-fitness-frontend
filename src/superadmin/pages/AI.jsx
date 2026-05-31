import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
import { getAIAnalyticsRequest, getAIGeneratedMealsRequest } from "@/api/ai";
import {
  Brain,
  CheckCheck,
  Pencil,
  RefreshCcw,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

function formatRelativeTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SuperAdminAIPage() {
  const [analytics, setAnalytics] = useState(null);
  const [generatedMeals, setGeneratedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "AI Analytics — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [analyticsData, meals] = await Promise.all([
          getAIAnalyticsRequest(),
          getAIGeneratedMealsRequest(50),
        ]);
        if (ignore) return;
        setAnalytics(analyticsData);
        setGeneratedMeals(meals);
      } catch {
        if (!ignore) setError("Unable to load AI analytics data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const totalGenerated = analytics?.totalGenerated ?? 0;
  const regenerated = analytics?.regenerated ?? 0;
  const regenRate = analytics?.regenRate ?? 0;
  const goalsTotal = (analytics?.goalSplit ?? []).reduce((a, r) => a + r.count, 0);

  const feedback = [
    { label: "5 — Loved it", count: 0 },
    { label: "4 — Good", count: 0 },
    { label: "3 — Okay", count: 0 },
    { label: "2 — Meh", count: 0 },
    { label: "1 — Bad", count: 0 },
  ];
  const feedbackTotal = 0;

  return (
    <AdminShell>
      <PageHeader
        title="AI Analytics"
        subtitle="How the AI meal-plan engine is being used and rated."
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Sparkles}
          label="Plans generated"
          value={loading ? "..." : totalGenerated}
          trend={`${analytics?.last30Days ?? 0} in last 30 days`}
          tone="primary"
        />
        <StatCard
          icon={RefreshCcw}
          label="Regeneration rate"
          value={loading ? "..." : regenRate}
          suffix="%"
          trend={`${regenerated.toLocaleString()} regens`}
          tone={regenRate > 30 ? "destructive" : "warning"}
        />
        <StatCard
          icon={Star}
          label="Unique users"
          value={loading ? "..." : analytics?.uniqueUsers ?? 0}
          trend="with at least 1 plan"
          tone="success"
        />
        <StatCard
          icon={CheckCheck}
          label="Meals generated"
          value={loading ? "..." : generatedMeals.reduce((a, m) => a + (m.mealCount || 0), 0)}
          trend="across recent plans"
          tone="accent"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BreakdownCard
          title="Plans by goal"
          icon={ThumbsUp}
          rows={(analytics?.goalSplit ?? []).map((r) => ({
            label: r.label,
            count: r.count,
            total: goalsTotal,
          }))}
          emptyLabel="No generated plans yet"
        />
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 grid place-items-center">
              <Brain className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">Plan outcome split</h3>
          </div>
          <div className="mt-6 space-y-5">
            <Donut
              label="First-time generated"
              value={analytics?.uniqueUsers ?? 0}
              total={totalGenerated}
              tone="success"
            />
            <Donut label="Regenerated" value={regenerated} total={totalGenerated} tone="destructive" />
            <Donut
              label="Total plans"
              value={totalGenerated}
              total={totalGenerated || 1}
              tone="warning"
            />
          </div>
        </Card>
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 grid place-items-center">
              <ThumbsDown className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">Feedback</h3>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            User ratings are not tracked yet. Connect a feedback table to populate this section.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {feedback.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span>{feedbackTotal ? item.count : "—"}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Pencil className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold text-slate-900">User generated meals</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Plan</th>
                <th className="px-4 py-3 font-medium">Generated meals</th>
                <th className="px-4 py-3 font-medium text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {!loading && generatedMeals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No AI generated meal plans yet.
                  </td>
                </tr>
              ) : (
                (loading
                  ? [{ id: "loading", user: "Loading...", action: "", plan: "", mealsSummary: "", createdAt: "" }]
                  : generatedMeals
                ).map((row) => (
                  <tr key={row.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.user}</p>
                      {!loading ? (
                        <p className="text-xs text-muted-foreground mt-0.5">{row.email}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {!loading ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.action === "Regenerated"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {row.action}
                        </span>
                      ) : (
                        "..."
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.plan}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-md">
                      <p>{row.mealsSummary}</p>
                      {!loading && row.mealCount ? (
                        <p className="text-xs mt-1 text-slate-500">{row.mealCount} meals in plan</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                      {loading ? "..." : formatRelativeTime(row.createdAt)}
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

function Donut({ label, value, total, tone }) {
  const p = total ? Math.round((value / total) * 100) : 0;
  const toneCls = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-red-500",
  }[tone];

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {value.toLocaleString()} · {p}%
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${toneCls}`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}
