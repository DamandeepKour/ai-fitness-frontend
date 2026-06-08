import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/admin/shared";
import { CheckCircle2, UserCheck, UserMinus, Users } from "lucide-react";

const users = [
  { name: "Riya Sharma", email: "riya@aifitnova.com", status: "Active", joined: "Jun 01" },
  { name: "Karan Patel", email: "karan@aifitnova.com", status: "Inactive", joined: "May 29" },
  { name: "Aman Verma", email: "aman@aifitnova.com", status: "Active", joined: "May 28" },
  { name: "Neha Khan", email: "neha@aifitnova.com", status: "Active", joined: "May 27" },
];

export default function SuperAdminUsersPage() {
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const inactive = total - active;

  return (
    <AdminShell>
      <PageHeader
        title="Users"
        subtitle="Superadmin view of user status and recent joiners."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total users" value={total} tone="primary" trend="current snapshot" />
        <StatCard icon={UserCheck} label="Active users" value={active} tone="success" trend="last 30 days" />
        <StatCard icon={UserMinus} label="Inactive users" value={inactive} tone="warning" trend="no recent activity" />
        <StatCard icon={CheckCircle2} label="Completion rate" value={82} suffix="%" tone="accent" trend="profiles completed" />
      </section>

      <Card className="p-6 rounded-2xl border border-slate-200 bg-white">
        <h2 className="text-base font-semibold mb-4">Recent users</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-3">{user.status}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
