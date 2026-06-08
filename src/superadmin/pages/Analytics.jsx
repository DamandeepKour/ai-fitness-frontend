import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { BreakdownCard, PageHeader, StatCard } from "@/components/admin/shared";
import { BarChart3, Globe, TrendingUp, Users } from "lucide-react";

const trafficSources = [
  { label: "Organic", count: 4120 },
  { label: "Social", count: 2190 },
  { label: "Direct", count: 1740 },
  { label: "Referral", count: 980 },
];
const sourceTotal = trafficSources.reduce((sum, item) => sum + item.count, 0);

const regionSplit = [
  { label: "India", count: 4870 },
  { label: "UAE", count: 1310 },
  { label: "UK", count: 840 },
  { label: "US", count: 710 },
];
const regionTotal = regionSplit.reduce((sum, item) => sum + item.count, 0);

export default function SuperAdminAnalyticsPage() {
  return (
    <AdminShell>
      <PageHeader
        title="Analytics"
        subtitle="High-level growth, traffic, and geography overview."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Monthly active users" value={8621} tone="primary" trend="+9.1% MoM" />
        <StatCard icon={TrendingUp} label="Signup conversion" value={18.4} suffix="%" tone="success" trend="landing to signup" />
        <StatCard icon={BarChart3} label="Avg session time" value={11.2} suffix="m" tone="warning" trend="per active user" />
        <StatCard icon={Globe} label="Countries reached" value={27} tone="accent" trend="with active users" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BreakdownCard
          title="Traffic sources"
          icon={BarChart3}
          rows={trafficSources.map((item) => ({ ...item, total: sourceTotal }))}
        />
        <BreakdownCard
          title="Top regions"
          icon={Globe}
          rows={regionSplit.map((item) => ({ ...item, total: regionTotal }))}
        />
      </section>

      <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
        <h2 className="text-base font-semibold">Insight</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Organic remains the primary growth driver. Consider doubling down on high-retention
          geographies before scaling paid channels.
        </p>
      </Card>
    </AdminShell>
  );
}
