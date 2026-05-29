import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/shared";
import API from "@/api/axios";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";

function titleCase(value) {
  if (!value) return "—";
  return String(value).replace(/_/g, " ");
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value || "—"}</p>
    </div>
  );
}

export default function SuperAdminUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/superadmin/users/${id}`);
        if (!ignore) setUser(res.data?.data || null);
      } catch {
        if (!ignore) setError("Unable to load user profile.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (id) loadUser();
    return () => {
      ignore = true;
    };
  }, [id]);

  const isActive = user?.is_active;

  return (
    <AdminShell>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Link to="/superadmin" className="text-sm text-orange-600 hover:underline">
          Dashboard
        </Link>
      </div>

      <PageHeader
        title="User profile"
        subtitle={user ? `Full profile for ${user.name}` : "Loading user details..."}
      />

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      {loading ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </Card>
      ) : user ? (
        <>
          <Card className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-xl font-semibold text-white">
                {user.name
                  ?.split(/\s+/)
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500 inline-flex items-center gap-1.5 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                {user.mobile_number ? (
                  <p className="text-sm text-slate-500 inline-flex items-center gap-1.5 mt-1">
                    <Phone className="h-4 w-4" />
                    {user.country_code} {user.mobile_number}
                  </p>
                ) : null}
              </div>
              <Badge
                variant="outline"
                className={
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {user.user_type || "user"}
              </Badge>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-orange-500" />
              <h3 className="text-base font-semibold">Personal & fitness details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <ProfileField label="Age" value={user.age} />
              <ProfileField label="Gender" value={user.gender} />
              <ProfileField label="Height (cm)" value={user.height} />
              <ProfileField label="Weight (kg)" value={user.weight} />
              <ProfileField label="Goal" value={titleCase(user.goal)} />
              <ProfileField label="Diet type" value={titleCase(user.diet_type)} />
              <ProfileField label="Activity level" value={titleCase(user.activity_level)} />
              <ProfileField label="Language" value={user.language || "—"} />
              <ProfileField label="Country code" value={user.country_code} />
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-semibold mb-3">Account activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProfileField label="Created at" value={formatDate(user.created_at)} />
              <ProfileField label="Last updated" value={formatDate(user.last_updated_at)} />
              <ProfileField label="Last login" value={formatDate(user.last_login)} />
              <ProfileField label="User ID" value={String(user.id)} />
            </div>
          </Card>
        </>
      ) : (
        <Card className="rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-sm text-muted-foreground">User not found.</p>
        </Card>
      )}
    </AdminShell>
  );
}
