import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard } from "@/components/admin/shared";
import { getSupportTicketsRequest, updateSupportTicketStatusRequest } from "@/api/support";
import { CheckCircle2, Clock, Inbox, MessageSquare, RefreshCw } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status) {
  if (status === "resolved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "in_progress") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export default function SuperAdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    document.title = "Support Tickets — AIFitnova Admin";
  }, []);

  const loadTickets = useCallback(async (status) => {
    setLoading(true);
    setError("");
    try {
      const data = await getSupportTicketsRequest({ status: status || undefined, limit: 100 });
      setTickets(data.tickets ?? []);
      setCounts(data.counts ?? { total: 0, open: 0, inProgress: 0, resolved: 0 });
    } catch {
      setError("Unable to load support tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets(filter);
  }, [filter, loadTickets]);

  async function handleStatusChange(ticketId, status) {
    setUpdatingId(ticketId);
    try {
      await updateSupportTicketStatusRequest(ticketId, status);
      await loadTickets(filter);
    } catch {
      setError("Failed to update ticket status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell>
      <PageHeader
        title="Support Tickets"
        subtitle="Contact form submissions from the website — triage and resolve user issues."
        action={
          <Button type="button" variant="outline" size="sm" onClick={() => loadTickets(filter)}>
            <RefreshCw className="h-4 w-4 mr-2" />
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
        <StatCard icon={Inbox} label="Total tickets" value={loading ? "..." : counts.total} trend="all time" tone="primary" />
        <StatCard icon={MessageSquare} label="Open" value={loading ? "..." : counts.open} trend="needs response" tone="destructive" />
        <StatCard icon={Clock} label="In progress" value={loading ? "..." : counts.inProgress} trend="being handled" tone="warning" />
        <StatCard icon={CheckCircle2} label="Resolved" value={loading ? "..." : counts.resolved} trend="closed" tone="success" />
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value || "all"}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                filter === item.value
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No tickets found. Users submit via the website contact page.
                  </td>
                </tr>
              ) : (
                (loading
                  ? [{ id: "loading", name: "Loading...", email: "", message: "", status: "open", createdAt: null }]
                  : tickets
                ).map((ticket) => (
                  <tr key={ticket.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ticket.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-md">
                      <p className="line-clamp-3">{ticket.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      {!loading ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(ticket.status)}`}
                        >
                          {String(ticket.status).replace(/_/g, " ")}
                        </span>
                      ) : (
                        "..."
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {loading ? "..." : formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {!loading ? (
                        <select
                          value={ticket.status}
                          disabled={updatingId === ticket.id}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="h-9 rounded-lg border border-border bg-white px-2 text-xs"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
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
    </AdminShell>
  );
}
