import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/admin/shared";
import { Activity, Clock3, TrendingUp, UserCheck } from "lucide-react";

const activityLog = [
  { event: "Meal plan generated", actor: "Riya Sharma", time: "2 min ago" },
  { event: "Weight update logged", actor: "Aman Verma", time: "8 min ago" },
  { event: "Profile updated", actor: "Neha Khan", time: "14 min ago" },
  { event: "New signup", actor: "Karan Patel", time: "31 min ago" },
];

export default function SuperAdminActivityPage() {
  return (
    <AdminShell>
      <PageHeader
        title="Activity"
        subtitle="Recent platform actions and operational health signals."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Events today" value={1284} tone="primary" trend="+6.3% vs yesterday" />
        <StatCard icon={UserCheck} label="Active sessions" value={312} tone="success" trend="currently online" />
        <StatCard icon={Clock3} label="Avg response time" value={184} suffix="ms" tone="warning" trend="API health" />
        <StatCard icon={TrendingUp} label="Engagement score" value={74} suffix="%" tone="accent" trend="rolling 7-day avg" />
      </section>

      <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
        <h2 className="text-base font-semibold mb-4">Latest activity</h2>
        <div className="space-y-3">
          {activityLog.map((item) => (
            <div
              key={`${item.event}-${item.actor}`}
              className="flex items-center justify-between rounded-xl border border-border p-3"
            >
              <div>
                <p className="font-medium">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.actor}</p>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
