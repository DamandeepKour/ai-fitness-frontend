import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/admin/shared";
import { getFunnelAnalyticsRequest } from "@/api/analytics";
import { Filter, TrendingDown, TrendingUp, Users } from "lucide-react";

export default function SuperAdminFunnelPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Conversion Funnel — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const analytics = await getFunnelAnalyticsRequest();
        if (!ignore) setData(analytics);
      } catch {
        if (!ignore) setError("Unable to load funnel analytics.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const steps = data?.steps ?? [];
  const maxCount = steps[0]?.count || 1;

  return (
    <AdminShell>
      <PageHeader
        title="Conversion Funnel"
        subtitle="Signup → onboarding → plan → meal log → paid → active user journey."
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total signups"
          value={loading ? "..." : data?.signups ?? 0}
          trend="top of funnel"
          tone="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Onboarding → plan"
          value={loading ? "..." : data?.onboardingToPlan ?? 0}
          suffix="%"
          trend="profile to AI plan"
          tone="success"
        />
        <StatCard
          icon={Filter}
          label="Plan → meal log"
          value={loading ? "..." : data?.planToMealLog ?? 0}
          suffix="%"
          trend="activation signal"
          tone="accent"
        />
        <StatCard
          icon={TrendingDown}
          label="Overall paid conversion"
          value={loading ? "..." : data?.overallConversion ?? 0}
          suffix="%"
          trend="signup to paid"
          tone="warning"
        />
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Funnel steps</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Each bar shows users reaching that stage; drop-off is vs. the previous step.
        </p>
        <div className="mt-6 space-y-4">
          {(loading ? Array.from({ length: 6 }, (_, i) => ({ key: i, label: "...", count: 0 })) : steps).map(
            (step, index) => {
              const width = maxCount ? Math.round((step.count / maxCount) * 100) : 0;
              return (
                <div key={step.key ?? index} className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-slate-800">
                      {index + 1}. {step.label}
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      {loading ? "..." : step.count.toLocaleString()} users
                      {!loading && step.rate != null ? ` · ${step.rate}% of signups` : ""}
                      {!loading && index > 0 && step.dropoff > 0 ? (
                        <span className="text-red-500 ml-2">−{step.dropoff}% drop</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="h-10 rounded-xl bg-slate-100 overflow-hidden relative">
                    <div
                      className="h-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 transition-all flex items-center px-3"
                      style={{ width: `${Math.max(width, loading ? 0 : 8)}%` }}
                    >
                      {!loading && width > 15 ? (
                        <span className="text-xs font-semibold text-white">{step.stepConversion}% step conv.</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </Card>
    </AdminShell>
  );
}
