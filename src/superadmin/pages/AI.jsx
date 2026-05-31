import { useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
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

const recent = [
  { user: "Aarav S.", action: "Generated", plan: "Weight loss · 1800kcal", rating: 5, time: "2m ago" },
  { user: "Sofia M.", action: "Regenerated", plan: "Vegan high-protein", rating: 3, time: "14m ago" },
  { user: "Liam O.", action: "Edited", plan: "Bulk · 3000kcal", rating: 4, time: "38m ago" },
  { user: "Priya P.", action: "Accepted", plan: "Maintenance", rating: 5, time: "1h ago" },
  { user: "Yuki T.", action: "Regenerated", plan: "Keto · 1600kcal", rating: 2, time: "2h ago" },
];

export default function SuperAdminAIPage() {
  useEffect(() => {
    document.title = "AI Analytics — AIFitnova Admin";
  }, []);

  const totalGenerated = 12480;
  const regenerated = 3210;
  const accepted = 7140;
  const edited = 2130;
  const regenRate = Math.round((regenerated / totalGenerated) * 100);
  const acceptedVsEdited = Math.round((accepted / (accepted + edited)) * 100);
  const avgRating = 4.2;

  const feedback = [
    { label: "5 — Loved it", count: 5240 },
    { label: "4 — Good", count: 3810 },
    { label: "3 — Okay", count: 1620 },
    { label: "2 — Meh", count: 920 },
    { label: "1 — Bad", count: 540 },
  ];
  const feedbackTotal = feedback.reduce((a, r) => a + r.count, 0);

  return (
    <AdminShell>
      <PageHeader
        title="AI Analytics"
        subtitle="How the AI meal-plan engine is being used and rated."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Sparkles}
          label="Plans generated"
          value={totalGenerated}
          trend="last 30 days"
          tone="primary"
        />
        <StatCard
          icon={RefreshCcw}
          label="Regeneration rate"
          value={regenRate}
          suffix="%"
          trend={`${regenerated.toLocaleString()} regens`}
          tone={regenRate > 30 ? "destructive" : "warning"}
        />
        <StatCard
          icon={Star}
          label="Avg feedback score"
          value={avgRating}
          suffix="/ 5"
          trend={`${feedbackTotal.toLocaleString()} ratings`}
          tone="success"
        />
        <StatCard
          icon={CheckCheck}
          label="Accepted vs edited"
          value={`${acceptedVsEdited}/${100 - acceptedVsEdited}`}
          trend="higher = users trust output"
          tone="accent"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BreakdownCard
          title="Feedback distribution"
          icon={ThumbsUp}
          rows={feedback.map((r) => ({ ...r, total: feedbackTotal }))}
        />
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 grid place-items-center">
              <Brain className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">Plan outcome split</h3>
          </div>
          <div className="mt-6 space-y-5">
            <Donut label="Accepted as-is" value={accepted} total={totalGenerated} tone="success" />
            <Donut label="Edited then saved" value={edited} total={totalGenerated} tone="warning" />
            <Donut label="Regenerated" value={regenerated} total={totalGenerated} tone="destructive" />
          </div>
        </Card>
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 grid place-items-center">
              <ThumbsDown className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-slate-900">Common rejection reasons</h3>
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              ["Too many repeat meals", 38],
              ["Doesn't fit my cuisine", 27],
              ["Macros off target", 18],
              ["Too expensive ingredients", 11],
              ["Other", 6],
            ].map(([label, p]) => (
              <li key={String(label)}>
                <div className="flex justify-between">
                  <span className="text-slate-700">{label}</span>
                  <span className="text-muted-foreground tabular-nums">{p}%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-red-400/70" style={{ width: `${p}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Pencil className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold text-slate-900">Recent AI activity</h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Plan</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{r.user}</td>
                  <td className="px-4 py-3">{r.action}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{r.plan}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-current" /> {r.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{r.time}</td>
                </tr>
              ))}
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
