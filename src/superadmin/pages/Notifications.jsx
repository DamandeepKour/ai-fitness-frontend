import { Card } from "@/components/ui/card";
import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/shared";
import { Bell } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "New user signup",
    body: "A new user registered on FitNova AI.",
    time: "12 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Profile completed",
    body: "A user completed full onboarding profile.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Weekly summary ready",
    body: "Your admin analytics summary is available.",
    time: "Yesterday",
    unread: false,
  },
];

export default function SuperAdminNotifications() {
  return (
    <AdminShell>
      <PageHeader title="Notifications" subtitle="Admin alerts and platform updates." />

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((item) => (
          <Card
            key={item.id}
            className={`rounded-2xl border p-4 flex gap-3 ${
              item.unread ? "border-orange-200 bg-orange-50/40" : "border-slate-200 bg-white"
            }`}
          >
            <span className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 grid place-items-center shrink-0">
              <Bell className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
