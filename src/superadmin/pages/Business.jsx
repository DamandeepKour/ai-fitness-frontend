import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
import { getBusinessAnalyticsRequest } from "@/api/business";
import {
  CreditCard,
  DollarSign,
  Package,
  Repeat,
  Ticket,
  UserMinus,
} from "lucide-react";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function SuperAdminBusinessPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Business Analytics — AIFitnova Admin";
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const analytics = await getBusinessAnalyticsRequest();
        if (!ignore) setData(analytics);
      } catch {
        if (!ignore) setError("Unable to load business analytics.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const signups = data?.signups ?? 0;
  const paid = data?.paid ?? 0;
  const conversion = data?.conversion ?? 0;
  const r7 = data?.retentionDay7 ?? 0;
  const r30 = data?.retentionDay30 ?? 0;
  const monthlyChurn = data?.monthlyChurn ?? 0;
  const churnTotal = data?.churnTotal ?? 0;
  const churnReasons = data?.churnReasons ?? [];
  const packages = data?.packages ?? [];
  const pkgTotal = data?.pkgTotal ?? 0;
  const coupons = data?.coupons ?? [];
  const revenue = data?.revenue ?? { mrr: 0, arpu: 0, ltv: 0, refunds: 0 };

  return (
    <AdminShell>
      <PageHeader
        title="Business Analytics"
        subtitle="Conversion, retention, churn, coupons, and package selection."
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Free → Paid conversion"
          value={loading ? "..." : conversion}
          suffix="%"
          trend={`${paid} of ${signups.toLocaleString()}`}
          tone="success"
        />
        <StatCard
          icon={Repeat}
          label="Retention · day 7"
          value={loading ? "..." : r7}
          suffix="%"
          trend="cohort: last 30 days"
          tone="primary"
        />
        <StatCard
          icon={Repeat}
          label="Retention · day 30"
          value={loading ? "..." : r30}
          suffix="%"
          trend="cohort: last 30 days"
          tone="accent"
        />
        <StatCard
          icon={UserMinus}
          label="Monthly churn"
          value={loading ? "..." : monthlyChurn}
          suffix="%"
          trend={`${churnTotal} cancellations`}
          tone="destructive"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BreakdownCard
          title="Churn reasons"
          icon={UserMinus}
          rows={churnReasons.map((r) => ({ ...r, total: churnTotal }))}
          emptyLabel="No churn data yet"
        />
        <BreakdownCard
          title="Package selection"
          icon={Package}
          rows={packages.map((r) => ({ ...r, total: pkgTotal }))}
          emptyLabel="No package data yet"
        />
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Ticket className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold text-slate-900">Coupon usage</h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Redemptions</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Revenue ($)</th>
                <th className="px-4 py-3 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {!loading && coupons.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No coupon data yet.
                  </td>
                </tr>
              ) : (
                (loading ? [{ code: "...", redemptions: 0, revenue: 0 }] : coupons).map((c) => {
                  const max = coupons[0]?.redemptions || 1;
                  const w = max ? Math.round((c.redemptions / max) * 100) : 0;
                  return (
                    <tr key={c.code} className="border-t border-border">
                      <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                      <td className="px-4 py-3 tabular-nums">{c.redemptions}</td>
                      <td className="px-4 py-3 tabular-nums hidden sm:table-cell">
                        ${Number(c.revenue || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-2 w-40 max-w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${loading ? 0 : w}%` }}
                          />
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

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold text-slate-900">Revenue snapshot (last 30 days)</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["MRR", formatMoney(revenue.mrr)],
            ["ARPU", formatMoney(revenue.arpu)],
            ["LTV", formatMoney(revenue.ltv)],
            ["Refunds", formatMoney(revenue.refunds)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {loading ? "..." : value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
