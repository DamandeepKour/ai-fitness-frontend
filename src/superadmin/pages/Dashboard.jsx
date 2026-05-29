import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import API from "@/api/axios";
import {
  Activity,
  CheckCircle2,
  Globe,
  Languages,
  Search,
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

        let completeProfilesRes;
        try {
          completeProfilesRes = await API.get("/superadmin/users/complete-profiles");
        } catch {
          completeProfilesRes = { data: { data: { users: [] } } };
        }

        if (ignore) return;
        setAnalytics(normalizeAnalytics(analyticsRes.data));
        const normalizedUsers = normalizeLogins(loginsRes.data);
        setAllUsers(normalizedUsers);
        setCompleteProfileUsers(toArray(completeProfilesRes?.data?.data?.users));
        setSelectedUserId(normalizedUsers[0]?.id || null);
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

  const recentLogins = useMemo(() => allUsers.slice(0, 8), [allUsers]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(
      (user) =>
        String(user.name || "").toLowerCase().includes(q) ||
        String(user.email || "").toLowerCase().includes(q),
    );
  }, [allUsers, search]);

  const selectedUser = useMemo(
    () => filteredUsers.find((user) => user.id === selectedUserId) || filteredUsers[0] || null,
    [filteredUsers, selectedUserId],
  );

  const activeFromList = useMemo(
    () => allUsers.filter((u) => String(u.status).toLowerCase() === "active").length,
    [allUsers],
  );

  const inactiveFromList = useMemo(
    () => allUsers.filter((u) => String(u.status).toLowerCase() !== "active").length,
    [allUsers],
  );

  const summaryCards = useMemo(
    () => [
      {
        icon: Users,
        label: "Total signups",
        value: analytics?.totalSignups || 0,
        note: "+12.4%",
      },
      {
        icon: Activity,
        label: "Active users",
        value: analytics?.activeUsers || 0,
        note: "+5.1%",
      },
      {
        icon: CheckCircle2,
        label: "Onboarding completed",
        value: analytics?.onboardingCompleted || 0,
        note: `${onboardingRate}% rate`,
      },
      {
        icon: TrendingUp,
        label: "Goal entries",
        value: goalRows.reduce((acc, row) => acc + row.count, 0),
        note: `across ${goalRows.length} goals`,
      },
    ],
    [analytics?.activeUsers, analytics?.onboardingCompleted, analytics?.totalSignups, goalRows, onboardingRate],
  );

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl border border-slate-200 bg-white px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Signups, activity, onboarding and preferences - all in one view.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="h-11 w-60 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-orange-300"
              />
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-xs font-semibold text-white">
              {selectedUser?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-5">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {summaryCards.map((item) => (
          <SummaryCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={loading ? "..." : item.value}
            note={loading ? "..." : item.note}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <BreakdownCard title="Goal split" rows={goalRows} />
        <BreakdownCard
          title="Region preference"
          icon={Globe}
          rows={analytics?.regionPreference || []}
          emptyLabel="No region data yet"
        />
        <BreakdownCard
          title="Language preference"
          icon={Languages}
          rows={analytics?.languagePreference || []}
          emptyLabel="No language data yet"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)] gap-4">
        <Card className="rounded-2xl border border-slate-200 bg-white p-5">
          <section id="user-activity" className="scroll-mt-24">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">User Activity</h3>
              <p className="text-xs text-muted-foreground">
                Recent logins and active/inactive state overview.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 mb-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">Active</p>
                <p className="text-xl font-semibold mt-0.5 text-slate-900">{loading ? "..." : activeFromList}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Inactive</p>
                <p className="text-xl font-semibold mt-0.5 text-slate-900">{loading ? "..." : inactiveFromList}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm overflow-hidden rounded-xl">
                <thead>
                  <tr className="text-left text-slate-500 border-y border-slate-200 bg-slate-50">
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
                        No activity records available.
                      </td>
                    </tr>
                  ) : null}
                  {(loading ? [{ id: "loading" }] : recentLogins).map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4">{loading ? "Loading..." : row.name}</td>
                      <td className="py-3 pr-4 text-slate-500">
                        {loading ? "Loading..." : row.email}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {loading ? "Loading..." : formatDate(row.lastLogin)}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">
                          {loading ? "Loading..." : row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-5 h-fit">
          <section id="per-user-activity" className="scroll-mt-24">
            <h3 className="text-lg font-semibold">Selected user</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Quick profile of the user picked from the list.
            </p>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading user activity...</p>
            ) : selectedUser ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-200 to-rose-300 flex items-center justify-center text-orange-700 font-semibold">
                    {selectedUser.name
                      .split(/\s+/)
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{selectedUser.name}</p>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Status</p>
                    <p className="font-semibold mt-1 text-emerald-700">{selectedUser.status}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Last Login</p>
                    <p className="font-semibold mt-1">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-2.5 text-sm font-medium text-white"
                >
                  View full profile
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No user selected.</p>
            )}
          </section>
        </Card>
      </div>

      <section id="user-list" className="scroll-mt-24">
        <Card className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">User List</h3>
                <p className="text-xs text-muted-foreground">All users for admin operations.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-y border-slate-200 bg-slate-50">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Last Login</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={5} className="py-5 text-muted-foreground">
                        No users found for this search.
                      </td>
                    </tr>
                  ) : null}
                  {(loading ? [{ id: "loading" }] : filteredUsers).map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4">{loading ? "Loading..." : row.name}</td>
                      <td className="py-3 pr-4 text-slate-500">
                        {loading ? "Loading..." : row.email}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">
                        {loading ? "Loading..." : formatDate(row.lastLogin)}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">
                          {loading ? "Loading..." : row.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {!loading ? (
                          <button
                            type="button"
                            className="text-xs font-medium text-slate-900 hover:text-orange-600"
                            onClick={() => setSelectedUserId(row.id)}
                          >
                            View activity
                          </button>
                        ) : (
                          "Loading..."
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </Card>
      </section>

      <section id="complete-profiles" className="scroll-mt-24">
        <Card className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Complete User Profiles</h3>
            <p className="text-xs text-muted-foreground">
              Users who have completed all profile fields in database.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-y border-slate-200 bg-slate-50">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Mobile</th>
                  <th className="py-2 pr-4 font-medium">Goal</th>
                  <th className="py-2 pr-4 font-medium">Diet</th>
                  <th className="py-2 pr-4 font-medium">Activity</th>
                  <th className="py-2 font-medium">User Type</th>
                </tr>
              </thead>
              <tbody>
                {!loading && completeProfileUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-5 text-muted-foreground">
                      No complete user profiles found yet.
                    </td>
                  </tr>
                ) : null}
                {(loading ? [{ id: "loading" }] : completeProfileUsers).map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4">{loading ? "Loading..." : user.name}</td>
                    <td className="py-3 pr-4 text-slate-500">{loading ? "Loading..." : user.email}</td>
                    <td className="py-3 pr-4 text-slate-500">
                      {loading ? "Loading..." : `${user.country_code || ""} ${user.mobile_number || ""}`}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{loading ? "Loading..." : user.goal}</td>
                    <td className="py-3 pr-4 text-slate-500">{loading ? "Loading..." : user.diet_type}</td>
                    <td className="py-3 pr-4 text-slate-500">{loading ? "Loading..." : user.activity_level}</td>
                    <td className="py-3">
                      <span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-2.5 py-0.5 text-xs text-orange-700">
                        {loading ? "Loading..." : user.user_type || "user"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, note }) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center">
          <Icon className="h-4 w-4 text-orange-500" />
        </span>
      </div>
      <p className="text-4xl font-semibold mt-2 tracking-tight text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{note}</p>
    </Card>
  );
}

function BreakdownCard({ title, rows, icon: Icon, emptyLabel = "No data available" }) {
  const total = rows.reduce((acc, row) => acc + row.count, 0);
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        {Icon ? (
          <span className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-orange-500" />
          </span>
        ) : null}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="space-y-3 mt-4">
        {rows?.length ? (
          rows.map((row) => (
            <div
              key={row.label || row.name}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-slate-700">{row.label || row.name}</span>
                <span className="text-slate-500">
                  {row.count}
                  {total ? ` (${pct(row.count, total)}%)` : ""}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
                  style={{ width: `${total ? pct(row.count, total) : 0}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        )}
      </div>
    </Card>
  );
}
