import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/admin/shared";
import {
  getAIQualityAnalyticsRequest,
  getCohortAnalyticsRequest,
  getFunnelAnalyticsRequest,
  getRetentionAnalyticsRequest,
} from "@/api/analytics";
import { getNutritionAnalyticsRequest } from "@/api/nutrition";
import { getSupportTicketsRequest } from "@/api/support";
import {
  ArrowRight,
  Brain,
  Filter,
  MessageSquare,
  Repeat,
  Target,
  Utensils,
} from "lucide-react";

const PHASE2_LINKS = [
  {
    to: "/superadmin/funnel",
    icon: Filter,
    title: "Conversion funnel",
    description: "Signup → onboarding → plan → meal log → paid → active",
  },
  {
    to: "/superadmin/retent",
    icon: Repeat,
    title: "Retention & cohorts",
    description: "Day 7/30 retention curves and weekly cohort matrix",
  },
  {
    to: "/superadmin/nutrition",
    icon: Utensils,
    title: "Meal adherence",
    description: "Logging patterns, skipped meals, and calorie targets",
  },
  {
    to: "/superadmin/ai",
    icon: Brain,
    title: "AI quality",
    description: "Plan adoption, regeneration rate, and quality score",
  },
  {
    to: "/superadmin/support",
    icon: MessageSquare,
    title: "Support tickets",
    description: "Website contact form submissions and triage",
  },
];

export default function SuperAdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({});

  useEffect(() => {
    document.title = "Phase 2 Analytics — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [funnel, retention, cohort, nutrition, aiQuality, support] = await Promise.all([
          getFunnelAnalyticsRequest(),
          getRetentionAnalyticsRequest(),
          getCohortAnalyticsRequest(),
          getNutritionAnalyticsRequest(),
          getAIQualityAnalyticsRequest(),
          getSupportTicketsRequest({ limit: 1 }),
        ]);

        if (ignore) return;

        setSummary({
          paidConversion: funnel?.overallConversion ?? 0,
          day7Retention: retention?.day7 ?? 0,
          mealAdherence: nutrition?.avgAdherence ?? 0,
          aiQualityScore: aiQuality?.qualityScore ?? 0,
          openTickets: support?.counts?.open ?? 0,
          cohortAvg: cohort?.averages?.day7 ?? 0,
        });
      } catch {
        if (!ignore) setError("Unable to load Phase 2 analytics summary.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AdminShell>
      <PageHeader
        title="Phase 2 Analytics"
        subtitle="Funnel, retention, meal adherence, AI quality, support tickets, and cohort analytics."
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          icon={Filter}
          label="Paid conversion"
          value={loading ? "..." : summary.paidConversion}
          suffix="%"
          trend="signup → paid"
          tone="primary"
        />
        <StatCard
          icon={Repeat}
          label="Day 7 retention"
          value={loading ? "..." : summary.day7Retention}
          suffix="%"
          trend={`cohort avg ${summary.cohortAvg ?? 0}%`}
          tone="success"
        />
        <StatCard
          icon={Target}
          label="Meal adherence"
          value={loading ? "..." : summary.mealAdherence}
          suffix="%"
          trend="7-day rolling avg"
          tone="accent"
        />
        <StatCard
          icon={Brain}
          label="AI quality score"
          value={loading ? "..." : summary.aiQualityScore}
          suffix="/100"
          trend="adoption + regen signals"
          tone="warning"
        />
        <StatCard
          icon={MessageSquare}
          label="Open tickets"
          value={loading ? "..." : summary.openTickets}
          trend="needs triage"
          tone="destructive"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PHASE2_LINKS.map((item) => (
          <Link key={item.to} to={item.to} className="group">
            <Card className="h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 grid place-items-center">
                  <item.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500 transition" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </Card>
          </Link>
        ))}
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">How dashboards differ</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
          <DashboardRole
            title="User dashboard"
            path="/dashboard"
            audience="End users (user_type: user)"
            points={[
              "Log meals, track calories, and view personal progress",
              "Generate AI meal plans and follow daily targets",
              "Data here feeds superadmin analytics (daily_logs, plans)",
            ]}
          />
          <DashboardRole
            title="Admin dashboard (superadmin)"
            path="/superadmin"
            audience="Platform operators (user_type: superadmin)"
            points={[
              "Phase 2 analytics: funnel, retention, cohorts, adherence",
              "AI quality signals, support ticket triage, business metrics",
              "Uses /api/superadmin/* — not available to regular users",
            ]}
          />
          <DashboardRole
            title="Website"
            path="/contact"
            audience="Visitors & prospects"
            points={[
              "Marketing pages and public contact form",
              "Contact submissions become support tickets in superadmin",
              "No analytics access — signup flows into user dashboard",
            ]}
          />
        </div>
      </Card>
    </AdminShell>
  );
}

function DashboardRole({ title, path, audience, points }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-orange-600 mt-1 font-mono">{path}</p>
      <p className="text-xs text-muted-foreground mt-2">{audience}</p>
      <ul className="mt-3 space-y-1.5 text-muted-foreground list-disc pl-4">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
