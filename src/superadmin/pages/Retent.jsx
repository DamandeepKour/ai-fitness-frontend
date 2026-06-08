import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/admin/shared";
import { getCohortAnalyticsRequest, getRetentionAnalyticsRequest } from "@/api/analytics";
import { CalendarRange, Repeat, TrendingUp, Users } from "lucide-react";

export default function SuperAdminRetentPage() {
  const [retention, setRetention] = useState(null);
  const [cohorts, setCohorts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Retention & Cohorts — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [retentionData, cohortData] = await Promise.all([
          getRetentionAnalyticsRequest(),
          getCohortAnalyticsRequest(),
        ]);
        if (ignore) return;
        setRetention(retentionData);
        setCohorts(cohortData);
      } catch {
        if (!ignore) setError("Unable to load retention analytics.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const curve = retention?.curve ?? [];
  const cohortRows = cohorts?.cohorts ?? [];
  const maxRate = Math.max(...curve.map((c) => c.rate), 1);

  return (
    <AdminShell>
      <PageHeader
        title="Retention & Cohort Analytics"
        subtitle="Day-over-day retention curves and weekly signup cohort performance."
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Repeat}
          label="Day 7 retention"
          value={loading ? "..." : retention?.day7 ?? 0}
          suffix="%"
          trend={`cohort n=${retention?.day7CohortSize ?? 0}`}
          tone="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Day 30 retention"
          value={loading ? "..." : retention?.day30 ?? 0}
          suffix="%"
          trend={`cohort n=${retention?.day30CohortSize ?? 0}`}
          tone="success"
        />
        <StatCard
          icon={CalendarRange}
          label="Avg cohort D7"
          value={loading ? "..." : cohorts?.averages?.day7 ?? 0}
          suffix="%"
          trend="weekly cohorts"
          tone="accent"
        />
        <StatCard
          icon={Users}
          label="Cohorts tracked"
          value={loading ? "..." : cohortRows.length}
          trend="last 8 weeks"
          tone="warning"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Retention curve</h2>
          <p className="text-sm text-muted-foreground mt-1">Users active on or after each day post-signup (90-day window).</p>
          <div className="mt-6 flex items-end gap-3 h-48">
            {(loading ? [1, 3, 7, 14, 30].map((d) => ({ day: d, rate: 0 })) : curve).map((point) => (
              <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold tabular-nums">{loading ? "..." : `${point.rate}%`}</span>
                <div className="w-full bg-slate-100 rounded-md overflow-hidden flex items-end h-32">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-rose-400 transition-all"
                    style={{ height: loading ? "0%" : `${Math.round((point.rate / maxRate) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">D{point.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Cohort averages</h2>
          <p className="text-sm text-muted-foreground mt-1">Rolling average across eligible weekly cohorts.</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ["Day 7", cohorts?.averages?.day7],
              ["Day 14", cohorts?.averages?.day14],
              ["Day 30", cohorts?.averages?.day30],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{loading ? "..." : `${value ?? 0}%`}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Weekly cohort matrix</h2>
        <p className="text-sm text-muted-foreground mt-1">Retention % by signup week at day 7, 14, and 30.</p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Cohort</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Day 7</th>
                <th className="px-4 py-3 font-medium">Day 14</th>
                <th className="px-4 py-3 font-medium">Day 30</th>
              </tr>
            </thead>
            <tbody>
              {!loading && cohortRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No cohort data yet.
                  </td>
                </tr>
              ) : (
                (loading
                  ? [{ key: "loading", label: "Loading...", cohortSize: 0, day7: 0, day14: 0, day30: 0 }]
                  : cohortRows
                ).map((row) => (
                  <tr key={row.key} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{row.label}</td>
                    <td className="px-4 py-3 tabular-nums">{row.cohortSize}</td>
                    <td className="px-4 py-3">
                      <RetentionCell value={row.day7} retained={row.retainedDay7} />
                    </td>
                    <td className="px-4 py-3">
                      <RetentionCell value={row.day14} retained={row.retainedDay14} />
                    </td>
                    <td className="px-4 py-3">
                      <RetentionCell value={row.day30} retained={row.retainedDay30} />
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

function RetentionCell({ value, retained }) {
  const tone =
    value >= 40 ? "text-emerald-700 bg-emerald-50" : value >= 20 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${tone}`}>
      {value}% ({retained})
    </span>
  );
}
