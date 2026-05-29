import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminShell from "@/components/admin/AdminShell";
import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
import API from "@/api/axios";
import {
  Activity,
  CheckCircle2,
  Globe,
  Languages,
  Search,
  TrendingUp,
  UserCircle2,
  Users,
} from "lucide-react";

const pct = (n, d) => (!d ? 0 : Math.round((n / d) * 100));

const formatDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function titleCase(label) {
  return String(label || "Unknown")
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function normalizeAnalytics(raw) {
  const payload = raw?.data ?? raw ?? {};
  const goals = payload.goalSplit || payload.goal_split || {};

  const loseKeys = ["lose", "lose_weight", "weight_loss", "fat_loss"];
  const gainKeys = ["gain", "gain_weight", "muscle_gain"];
  const maintainKeys = ["maintain", "maintenance"];

  const sumKeys = (keys) => keys.reduce((acc, key) => acc + toNumber(goals[key]), 0);

  const regionPreference = Object.entries(payload.regionPreference || payload.region_preference || {}).map(
    ([name, count]) => ({ name: titleCase(name), count: toNumber(count) }),
  );

  const languagePreference = Object.entries(
    payload.languagePreference || payload.language_preference || {},
  ).map(([name, count]) => ({ name: titleCase(name), count: toNumber(count) }));

  return {
    totalSignups: toNumber(payload.totalSignups ?? payload.total_signups),
    activeUsers: toNumber(payload.activeUsers ?? payload.active_users),
    onboardingCompleted: toNumber(payload.onboardingCompleted ?? payload.onboarding_completed),
    goalSplit: {
      lose: sumKeys(loseKeys),
      gain: sumKeys(gainKeys),
      maintain: sumKeys(maintainKeys),
    },
    regionPreference,
    languagePreference,
  };
}

function normalizeUsers(raw) {
  const items = toArray(raw?.data?.users ?? raw?.users ?? raw);
  return items.map((item, index) => ({
    id: String(item.id ?? item.user_id ?? `row-${index}`),
    name: item.name || item.user_name || "Unknown user",
    email: item.email || "—",
    lastLogin: item.lastLogin || item.last_login || item.last_updated_at || item.created_at,
    status: item.status || (item.is_active || item.active ? "Active" : "Inactive"),
  }));
}

function Avatar({ name, size = "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const dim = size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-xs";
  return (
    <div
      className={`${dim} shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 grid place-items-center font-semibold text-white`}
    >
      {initials || "?"}
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = String(status).toLowerCase() === "active";
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-100 text-slate-600 border-slate-200"
      }
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
      />
      {status}
    </Badge>
  );
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [completeProfileUsers, setCompleteProfileUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const [analyticsRes, usersRes, completeRes] = await Promise.all([
          API.get("/superadmin/analytics"),
          API.get("/superadmin/users"),
          API.get("/superadmin/users/complete-profiles").catch(() => ({ data: { data: { users: [] } } })),
        ]);

        if (ignore) return;

        setAnalytics(normalizeAnalytics(analyticsRes.data));
        const users = normalizeUsers(usersRes.data);
        setAllUsers(users);
        setCompleteProfileUsers(toArray(completeRes?.data?.data?.users));
        setSelectedUserId(users[0]?.id ?? null);
      } catch {
        if (!ignore) setError("Unable to load admin dashboard data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const onboardingRate = analytics ? pct(analytics.onboardingCompleted, analytics.totalSignups) : 0;

  const goalRows = analytics
    ? [
        { label: "Lose weight", count: analytics.goalSplit.lose },
        { label: "Gain weight", count: analytics.goalSplit.gain },
        { label: "Maintain", count: analytics.goalSplit.maintain },
      ]
    : [];

  const goalsTotal = goalRows.reduce((a, r) => a + r.count, 0);

  const regionTotal = (analytics?.regionPreference ?? []).reduce((a, x) => a + x.count, 0);
  const languageTotal = (analytics?.languagePreference ?? []).reduce((a, x) => a + x.count, 0);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [allUsers, search]);

  const selectedUser =
    filteredUsers.find((u) => u.id === selectedUserId) || filteredUsers[0] || null;

  const activeCount = allUsers.filter((u) => String(u.status).toLowerCase() === "active").length;
  const inactiveCount = allUsers.length - activeCount;

  return (
    <AdminShell>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Signups, activity, onboarding & preferences — all in one view."
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
          value={loading ? "..." : analytics?.totalSignups ?? 0}
          trend="+12.4%"
          tone="primary"
        />
        <StatCard
          icon={Activity}
          label="Active users"
          value={loading ? "..." : analytics?.activeUsers ?? 0}
          trend="+5.1%"
          tone="success"
        />
        <StatCard
          icon={CheckCircle2}
          label="Onboarding completed"
          value={loading ? "..." : analytics?.onboardingCompleted ?? 0}
          trend={`${onboardingRate}% rate`}
          tone="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Goal entries"
          value={loading ? "..." : goalsTotal}
          trend="across 3 goals"
          tone="warning"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BreakdownCard
          title="Goal split"
          icon={TrendingUp}
          rows={goalRows.map((r) => ({ ...r, total: goalsTotal }))}
        />
        <BreakdownCard
          title="Region preference"
          icon={Globe}
          rows={(analytics?.regionPreference ?? []).map((r) => ({
            label: r.name,
            count: r.count,
            total: regionTotal,
          }))}
        />
        <BreakdownCard
          title="Language preference"
          icon={Languages}
          rows={(analytics?.languagePreference ?? []).map((r) => ({
            label: r.name,
            count: r.count,
            total: languageTotal,
          }))}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-slate-900">User activity</h2>
              <p className="text-sm text-muted-foreground">Recent logins and active/inactive snapshot.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-emerald-600">Active</p>
                <p className="text-lg font-semibold">{loading ? "..." : activeCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Inactive</p>
                <p className="text-lg font-semibold">{loading ? "..." : inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Last login</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  (loading ? [{ id: "loading", name: "Loading...", email: "", lastLogin: "", status: "" }] : allUsers.slice(0, 8)).map(
                    (u) => (
                      <tr key={u.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} />
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.email}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {formatDate(u.lastLogin)}
                        </td>
                        <td className="px-4 py-3">
                          {loading ? "..." : <StatusBadge status={u.status} />}
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-slate-900">Selected user</h2>
          </div>
          {selectedUser ? (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={selectedUser.name} size="lg" />
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Status</p>
                  <div className="mt-1.5">
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Last login</p>
                  <div className="mt-1.5 text-sm font-medium">{formatDate(selectedUser.lastLogin)}</div>
                </div>
              </div>
              <Button
                type="button"
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-90"
                onClick={() => navigate(`/superadmin/users/${selectedUser.id}`)}
              >
                View full profile
              </Button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">No user selected.</p>
          )}
        </Card>
      </section>

      <section>
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-slate-900">User list</h2>
              <p className="text-sm text-muted-foreground">Click a row to inspect.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-9 w-full sm:w-72 h-10"
              />
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Last login</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No users.
                    </td>
                  </tr>
                ) : (
                  (loading
                    ? [{ id: "loading", name: "Loading...", email: "", lastLogin: "", status: "" }]
                    : filteredUsers
                  ).map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={`border-t border-border cursor-pointer transition ${
                        selectedUserId === u.id ? "bg-orange-50/60" : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.email}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {formatDate(u.lastLogin)}
                      </td>
                      <td className="px-4 py-3">
                        {loading ? "..." : <StatusBadge status={u.status} />}
                      </td>
                      <td className="px-4 py-3">
                        {!loading ? (
                          <button
                            type="button"
                            className="text-xs font-medium text-orange-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/superadmin/users/${u.id}`);
                            }}
                          >
                            View profile
                          </button>
                        ) : (
                          "..."
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <Card className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Complete user profiles</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Users who filled all profile columns in the database.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Goal</th>
                  <th className="px-4 py-3 font-medium">Diet</th>
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {!loading && completeProfileUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No complete profiles yet.
                    </td>
                  </tr>
                ) : (
                  (loading ? [] : completeProfileUsers).map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} />
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{titleCase(u.goal)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{titleCase(u.diet_type)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{titleCase(u.activity_level)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-xs font-medium text-orange-600 hover:underline"
                          onClick={() => navigate(`/superadmin/users/${u.id}`)}
                        >
                          View profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </AdminShell>
  );
}
