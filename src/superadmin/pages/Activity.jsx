import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatCard } from "@/components/admin/shared";
import {
  getTrafficHistoryRequest,
  getTrafficLogsRequest,
  getTrafficSummaryRequest,
  getUserActivityRequest,
} from "@/api/traffic";
import {
  Activity,
  AlertTriangle,
  Clock3,
  Globe,
  History,
  Server,
  TrendingUp,
  UserCheck,
} from "lucide-react";

const TABS = [
  { id: "activity", label: "User activity", icon: Activity },
  { id: "logs", label: "API traffic logs", icon: Server },
  { id: "history", label: "Traffic history", icon: History },
];

const EVENT_TONES = {
  signup: "bg-emerald-50 text-emerald-700",
  meal_log: "bg-orange-50 text-orange-700",
  weight_update: "bg-blue-50 text-blue-700",
  plan_generated: "bg-violet-50 text-violet-700",
  profile_change: "bg-amber-50 text-amber-700",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatRelative(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function statusTone(code) {
  if (code >= 500) return "destructive";
  if (code >= 400) return "warning";
  if (code >= 300) return "accent";
  return "success";
}

function trendLabel(pct, suffix = "vs yesterday") {
  if (pct === 0) return `no change ${suffix}`;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}% ${suffix}`;
}

export default function SuperAdminActivityPage() {
  const [tab, setTab] = useState("activity");
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState({ events: [], pagination: {} });
  const [logs, setLogs] = useState({ logs: [], pagination: {} });
  const [history, setHistory] = useState({ buckets: [] });
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [logFilters, setLogFilters] = useState({ method: "", status: "", path: "" });

  useEffect(() => {
    document.title = "Activity — AIFitnova Admin";
  }, []);

  const loadSummary = useCallback(async () => {
    const data = await getTrafficSummaryRequest();
    setSummary(data);
  }, []);

  const loadTabData = useCallback(async () => {
    setTableLoading(true);
    setError("");

    try {
      if (tab === "activity") {
        const data = await getUserActivityRequest({ page, limit: 25 });
        setActivity(data);
      } else if (tab === "logs") {
        const data = await getTrafficLogsRequest({
          page,
          limit: 25,
          method: logFilters.method || undefined,
          status: logFilters.status || undefined,
          path: logFilters.path || undefined,
        });
        setLogs(data);
      } else {
        const data = await getTrafficHistoryRequest({ hours: 24 });
        setHistory(data);
      }
    } catch {
      setError("Unable to load monitoring data.");
    } finally {
      setTableLoading(false);
    }
  }, [tab, page, logFilters]);

  useEffect(() => {
    let ignore = false;

    async function init() {
      setLoading(true);
      setError("");
      try {
        const data = await getTrafficSummaryRequest();
        if (!ignore) setSummary(data);
      } catch {
        if (!ignore) setError("Unable to load monitoring data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  const maxRequests = useMemo(
    () => Math.max(...(history.buckets?.map((b) => b.requests) ?? [1]), 1),
    [history.buckets],
  );

  const pagination = tab === "logs" ? logs.pagination : activity.pagination;
  const canPrev = pagination.page > 1;
  const canNext = pagination.page < pagination.totalPages;

  return (
    <AdminShell>
      <PageHeader
        title="Activity & Traffic"
        subtitle="Monitor user actions, API requests, and platform traffic in real time."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setLoading(true);
              try {
                await loadSummary();
                await loadTabData();
              } finally {
                setLoading(false);
              }
            }}
          >
            Refresh
          </Button>
        }
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Activity}
          label="User events today"
          value={loading ? "..." : summary?.eventsToday ?? 0}
          tone="primary"
          trend={loading ? "" : trendLabel(summary?.eventsChangePct ?? 0)}
        />
        <StatCard
          icon={UserCheck}
          label="Active sessions"
          value={loading ? "..." : summary?.activeSessions ?? 0}
          tone="success"
          trend="users active in last 15 min"
        />
        <StatCard
          icon={Clock3}
          label="Avg response time"
          value={loading ? "..." : summary?.avgResponseTimeMs ?? 0}
          suffix="ms"
          tone="warning"
          trend={loading ? "" : `${summary?.apiRequestsToday ?? 0} API requests today`}
        />
        <StatCard
          icon={TrendingUp}
          label="Error rate"
          value={loading ? "..." : summary?.errorRatePct ?? 0}
          suffix="%"
          tone="accent"
          trend={loading ? "" : trendLabel(summary?.apiRequestsChangePct ?? 0, "API traffic")}
        />
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-2">
        <div className="flex flex-wrap gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      {tab === "logs" ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Filter by method (GET, POST...)"
              value={logFilters.method}
              onChange={(e) => {
                setLogFilters((f) => ({ ...f, method: e.target.value }));
                setPage(1);
              }}
            />
            <Input
              placeholder="Filter by status code"
              value={logFilters.status}
              onChange={(e) => {
                setLogFilters((f) => ({ ...f, status: e.target.value }));
                setPage(1);
              }}
            />
            <Input
              placeholder="Filter by path"
              value={logFilters.path}
              onChange={(e) => {
                setLogFilters((f) => ({ ...f, path: e.target.value }));
                setPage(1);
              }}
            />
          </div>
        </Card>
      ) : null}

      <Card className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {tab === "activity" ? (
          <ActivityTable events={activity.events} loading={tableLoading} />
        ) : null}
        {tab === "logs" ? <LogsTable logs={logs.logs} loading={tableLoading} /> : null}
        {tab === "history" ? (
          <HistoryChart buckets={history.buckets} maxRequests={maxRequests} loading={tableLoading} />
        ) : null}

        {tab !== "history" ? (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page ?? 1} of {pagination.totalPages ?? 1}
              {pagination.total ? ` · ${pagination.total} total` : ""}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canPrev || tableLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canNext || tableLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </AdminShell>
  );
}

function ActivityTable({ events, loading }) {
  if (loading && !events.length) {
    return <TablePlaceholder rows={6} cols={4} />;
  }

  if (!events.length) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        No user activity recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Event</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Detail</th>
            <th className="px-4 py-3 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {events.map((item) => (
            <tr key={`${item.eventType}-${item.userId}-${item.occurredAt}`} className="border-b border-slate-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge className={EVENT_TONES[item.eventType] || "bg-slate-100 text-slate-700"}>
                    {item.eventLabel}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{item.actorName}</p>
                <p className="text-xs text-muted-foreground">{item.actorEmail || `ID ${item.userId}`}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{item.detail || "—"}</td>
              <td className="px-4 py-3">
                <p className="text-slate-700">{formatRelative(item.occurredAt)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(item.occurredAt)}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogsTable({ logs, loading }) {
  if (loading && !logs.length) {
    return <TablePlaceholder rows={8} cols={6} />;
  }

  if (!logs.length) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        <Globe className="h-8 w-8 mx-auto mb-2 text-slate-300" />
        No API traffic logged yet. Requests will appear here as users interact with the app.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Method</th>
            <th className="px-4 py-3 font-medium">Path</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-slate-50">
              <td className="px-4 py-3 font-mono text-xs font-semibold">{log.method}</td>
              <td className="px-4 py-3 font-mono text-xs max-w-xs truncate" title={log.path}>
                {log.path}
              </td>
              <td className="px-4 py-3">
                <StatusBadge code={log.statusCode} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{log.durationMs} ms</td>
              <td className="px-4 py-3">
                <p className="font-medium">{log.userName}</p>
                {log.ip ? <p className="text-xs text-muted-foreground">{log.ip}</p> : null}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistoryChart({ buckets, maxRequests, loading }) {
  if (loading && !buckets.length) {
    return <TablePlaceholder rows={1} cols={1} />;
  }

  if (!buckets.length) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
        No hourly traffic data yet. History builds as API requests are logged.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">24-hour traffic</h2>
          <p className="text-sm text-muted-foreground">Hourly API request volume and error count</p>
        </div>
      </div>
      <div className="space-y-3">
        {buckets.map((bucket) => {
          const width = Math.round((bucket.requests / maxRequests) * 100);
          const errorPct = bucket.requests
            ? Math.round((bucket.errors / bucket.requests) * 100)
            : 0;
          return (
            <div key={bucket.bucket} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(bucket.bucket)}</span>
                <span>
                  {bucket.requests} req · {bucket.avgDurationMs} ms avg
                  {bucket.errors ? ` · ${bucket.errors} errors (${errorPct}%)` : ""}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all"
                  style={{ width: `${Math.max(width, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ code }) {
  const tone = statusTone(code);
  const classes = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    accent: "bg-blue-50 text-blue-700",
    destructive: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-semibold ${classes[tone]}`}>
      {code}
    </span>
  );
}

function TablePlaceholder({ rows, cols }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: cols }).map((__, colIndex) => (
            <div
              key={colIndex}
              className="h-8 flex-1 rounded-lg bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
