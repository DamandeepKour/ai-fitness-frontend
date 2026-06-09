import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard } from "@/components/admin/shared";
import { getCoachReviewQueueRequest, updateCoachReviewAdminRequest } from "@/api/premium";
import { CheckCircle2, Clock, Stethoscope, XCircle } from "lucide-react";

function statusClass(status) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700";
  if (status === "needs_changes") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export default function SuperAdminCoachReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCoachReviewQueueRequest();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Coach Reviews — AIFitnova Admin";
    load();
  }, [load]);

  async function handleUpdate(id, status) {
    setUpdating(id);
    try {
      await updateCoachReviewAdminRequest(id, {
        status,
        coachNotes: notes[id] || `Reviewed — ${status.replace(/_/g, " ")}`,
      });
      await load();
    } finally {
      setUpdating(null);
    }
  }

  const pending = reviews.filter((r) => r.status === "pending").length;
  const approved = reviews.filter((r) => r.status === "approved").length;

  return (
    <AdminShell>
      <PageHeader
        title="Coach Reviews"
        subtitle="Premium Phase 4 — human coach review queue for AI meal plans."
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Clock} label="Pending" value={loading ? "..." : pending} tone="warning" />
        <StatCard icon={CheckCircle2} label="Approved" value={loading ? "..." : approved} tone="success" />
        <StatCard icon={Stethoscope} label="Total" value={loading ? "..." : reviews.length} tone="primary" />
      </section>

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        {!loading && reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No coach review requests yet.</p>
        ) : (
          <div className="space-y-4">
            {(loading ? [] : reviews).map((review) => (
              <div key={review.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{review.user_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{review.user_email}</p>
                    <p className="text-xs mt-1">Plan #{review.plan_id || "—"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(review.status)}`}>
                    {review.status.replace(/_/g, " ")}
                  </span>
                </div>
                {review.user_notes ? (
                  <p className="text-sm text-muted-foreground mt-2">User: {review.user_notes}</p>
                ) : null}
                {review.coach_notes ? (
                  <p className="text-sm mt-2">Coach: {review.coach_notes}</p>
                ) : null}
                {review.status === "pending" ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className="w-full rounded-lg border border-border p-2 text-sm min-h-[60px]"
                      placeholder="Coach notes..."
                      value={notes[review.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [review.id]: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" disabled={updating === review.id} onClick={() => handleUpdate(review.id, "approved")}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" disabled={updating === review.id} onClick={() => handleUpdate(review.id, "needs_changes")}>
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Needs changes
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminShell>
  );
}
