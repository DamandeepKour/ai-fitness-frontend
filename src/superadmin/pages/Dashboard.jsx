import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import API from "@/api/axios";
import {
  Activity,
  CheckCircle2,
  Globe,
  Languages,
  TrendingUp,
  Users,
} from "lucide-react";

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function titleCase(label) {
  return String(label || "Unknown")
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function getValue(obj, keys, fallback = 0) {
  for (const key of keys) {
    if (obj?.[key] != null) return obj[key];
  }
  return fallback;
}

function normalizeAnalytics(raw) {
  const payload = raw?.data ?? raw ?? {};
  const users = toArray(payload.users);
  const totalSignups = toNumber(
    getValue(payload, ["totalSignups", "total_signups", "registrations_count"], users.length),
  );
  const activeUsers = toNumber(
    getValue(payload, ["activeUsers", "active_users", "activeUsersCount"], 0),
  );
  const onboardingCompleted = toNumber(
    getValue(payload, ["onboardingCompleted", "onboarding_completed", "onboardedUsers"], 0),
  );
  const goals = payload.goalSplit || payload.goal_split || payload.goals || {};
  const regionPreference =
    payload.regionPreference || payload.region_preference || payload.regions || {};
  const languagePreference =
    payload.languagePreference || payload.language_preference || payload.languages || {};

  return {
    totalSignups,
    activeUsers,
    onboardingCompleted,
    goalSplit: {
      lose:
        toNumber(getValue(goals, ["lose", "lose_weight", "weight_loss"], 0)),
      gain:
        toNumber(getValue(goals, ["gain", "gain_weight", "muscle_gain"], 0)),
      maintain:
        toNumber(getValue(goals, ["maintain", "maintenance"], 0)),
    },
    regionPreference: Object.entries(regionPreference).map(([name, count]) => ({
      name: titleCase(name),
      count: toNumber(count),
    })),
    languagePreference: Object.entries(languagePreference).map(([name, count]) => ({
      name: titleCase(name),
      count: toNumber(count),
    })),
  };
}

function formatDate(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString();
}

function normalizeLogins(raw) {
  const payload = raw?.data ?? raw ?? {};
  const items = toArray(payload.logins || payload.recentLogins || payload.recent_logins || payload.users);
  return items.map((item, index) => ({
    id: item?.id || item?.user_id || item?.email || `row-${index}`,
    name: item?.name || item?.user_name || "Unknown user",
    email: item?.email || "—",
    lastLogin: item?.lastLogin || item?.last_login || item?.updated_at || item?.created_at,
    status:
      item?.status ||
      (item?.is_active || item?.active ? "Active" : "Inactive"),
  }));
}

export default function SuperAdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentLogins, setRecentLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        let analyticsRes;
        try {
          analyticsRes = await API.get("/superadmin/users/analytics");
        } catch {
          analyticsRes = await API.get("/superadmin/analytics");
        }

        let loginsRes;
        try {
          loginsRes = await API.get("/superadmin/users/logins");
        } catch {
          loginsRes = await API.get("/superadmin/users");
        }

        if (ignore) return;
        setAnalytics(normalizeAnalytics(analyticsRes.data));
        setRecentLogins(normalizeLogins(loginsRes.data).slice(0, 8));
      } catch {
        if (ignore) return;
        setError("Unable to load superadmin analytics right now.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const onboardingRate = useMemo(() => {
    if (!analytics) return 0;
    return pct(analytics.onboardingCompleted, analytics.totalSignups);
  }, [analytics]);

  const goalRows = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: "Lose weight", count: analytics.goalSplit.lose },
      { label: "Gain weight", count: analytics.goalSplit.gain },
      { label: "Maintain", count: analytics.goalSplit.maintain },
    ];
  }, [analytics]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          User analytics with signups, activity, onboarding progress, goals, and login visibility.
        </p>
      </div>

      {error ? (
        <Card className="rounded-3xl border border-destructive/30 p-5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Signups"
          value={loading ? "..." : analytics?.totalSignups || 0}
        />
        <StatCard
          icon={Activity}
          label="Active Users"
          value={loading ? "..." : analytics?.activeUsers || 0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Onboarding Complete"
          value={loading ? "..." : `${analytics?.onboardingCompleted || 0} (${onboardingRate}%)`}
        />
        <StatCard
          icon={TrendingUp}
          label="Goal Records"
          value={loading ? "..." : goalRows.reduce((acc, row) => acc + row.count, 0)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <BreakdownCard title="Goal Split" rows={goalRows} />
        <BreakdownCard
          title="Region Preference"
          icon={Globe}
          rows={analytics?.regionPreference || []}
          emptyLabel="No region data yet"
        />
        <BreakdownCard
          title="Language Preference"
          icon={Languages}
          rows={analytics?.languagePreference || []}
          emptyLabel="No language data yet"
        />
      </div>

      <Card className="rounded-3xl p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Recent User Logins</h3>
          <p className="text-xs text-muted-foreground">
            Latest users with visible login timestamp and status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Last Login</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogins.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="py-5 text-muted-foreground">
                    No login records available.
                  </td>
                </tr>
              ) : null}
              {(loading ? [{ id: "loading" }] : recentLogins).map((row) => (
                <tr key={row.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">{loading ? "Loading..." : row.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {loading ? "Loading..." : row.email}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {loading ? "Loading..." : formatDate(row.lastLogin)}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs">
                      {loading ? "Loading..." : row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </span>
      </div>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </Card>
  );
}

function BreakdownCard({ title, rows, icon: Icon, emptyLabel = "No data available" }) {
  return (
    <Card className="rounded-3xl p-5">
      <div className="flex items-center gap-2">
        {Icon ? (
          <span className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </span>
        ) : null}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="space-y-2 mt-4">
        {rows?.length ? (
          rows.map((row) => (
            <div
              key={row.label || row.name}
              className="flex items-center justify-between rounded-xl bg-accent/50 px-3 py-2"
            >
              <span className="text-sm">{row.label || row.name}</span>
              <span className="text-sm font-semibold">{row.count}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        )}
      </div>
    </Card>
  );
}
