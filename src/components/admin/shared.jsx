import { Card } from "@/components/ui/card";

const toneIconClass = {
  primary: "bg-orange-50 text-orange-500",
  success: "bg-emerald-50 text-emerald-600",
  accent: "bg-rose-50 text-rose-500",
  warning: "bg-amber-50 text-amber-600",
};

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, trend, tone = "primary" }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span
          className={`h-9 w-9 rounded-xl flex items-center justify-center ${toneIconClass[tone] || toneIconClass.primary}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-4xl font-semibold mt-2 tracking-tight text-slate-900">{value}</p>
      {trend ? <p className="text-xs text-slate-500 mt-1">{trend}</p> : null}
    </Card>
  );
}

export function BreakdownCard({ title, icon: Icon, rows = [], emptyLabel = "No data available" }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        {Icon ? (
          <span className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-orange-500" />
          </span>
        ) : null}
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-3 mt-4">
        {rows.length ? (
          rows.map((row) => {
            const total = row.total || rows.reduce((acc, r) => acc + (r.count || 0), 0);
            const percent = total ? Math.round((row.count / total) * 100) : 0;
            return (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-700">{row.label}</span>
                  <span className="text-slate-500">
                    {row.count}
                    {total ? ` (${percent}%)` : ""}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        )}
      </div>
    </Card>
  );
}
