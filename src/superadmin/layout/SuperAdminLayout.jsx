import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { getAuthToken, getStoredUser } from "@/lib/auth-token";
import AdminProfileMenu from "@/components/admin/AdminProfileMenu";
import {
  Activity,
  BarChart3,
  Brain,
  DollarSign,
  Globe,
  HeartPulse,
  LayoutDashboard,
  RotateCcw,
  Settings,
  Sparkles,
  Utensils,
  Users,
  WandSparkles,
} from "lucide-react";

/** Superadmin shell — extend with role checks when backend supports it. */
export default function SuperAdminLayout() {
  const location = useLocation();
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  if (user?.user_type !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  const path = location.pathname;

  return (
    <div className="min-h-screen bg-slate-100/70">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[255px_minmax(0,1fr)]">
        <aside className="hidden md:flex flex-col border-r border-slate-800/70 bg-slate-950 text-slate-200">
          <div className="px-5 py-5 border-b border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">AIFitnova</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>

          <div className="px-3 py-4">
            <p className="px-3 text-[11px] uppercase tracking-[0.14em] text-slate-500">Overview</p>
            <div className="mt-2 space-y-1">
              <SidebarItem
                label="Dashboard"
                icon={LayoutDashboard}
                to="/superadmin"
                active={path === "/superadmin"}
              />
              <SidebarItem
                label="Users"
                icon={Users}
                to="/superadmin/users"
                active={path === "/superadmin/users" || path.startsWith("/superadmin/users/")}
              />
              <SidebarItem
                label="Activity"
                icon={Activity}
                to="/superadmin/activity"
                active={path === "/superadmin/activity"}
              />
              <SidebarItem
                label="Analytics"
                icon={BarChart3}
                to="/superadmin/analytics"
                active={path === "/superadmin/analytics"}
              />
              <SidebarItem
                label="AI Analytics"
                icon={Brain}
                to="/superadmin/ai"
                active={path === "/superadmin/ai"}
              />
              <SidebarItem
                label="Business"
                icon={DollarSign}
                to="/superadmin/business"
                active={path === "/superadmin/business"}
              />
              <SidebarItem
                label="Health"
                icon={HeartPulse}
                to="/superadmin/health"
                active={path === "/superadmin/health"}
              />
              <SidebarItem
                label="Nutrition"
                icon={Utensils}
                to="/superadmin/nutrition"
                active={path === "/superadmin/nutrition"}
              />
              <SidebarItem
                label="Retent"
                icon={RotateCcw}
                to="/superadmin/retent"
                active={path === "/superadmin/retent"}
              />
            </div>
          </div>

          <div className="px-3 py-3">
            <p className="px-3 text-[11px] uppercase tracking-[0.14em] text-slate-500">Configuration</p>
            <div className="mt-2 space-y-1">
              <SidebarItem label="Onboarding" icon={WandSparkles} to="/superadmin" active={false} />
              <SidebarItem label="Regions" icon={Globe} to="/superadmin" active={false} />
              <SidebarItem label="Languages" icon={Globe} to="/superadmin" active={false} />
              <SidebarItem label="Settings" icon={Settings} to="/superadmin/profile" active={path === "/superadmin/profile"} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 flex items-center justify-end gap-3 border-b border-slate-200 bg-white/90 backdrop-blur px-4 py-3 md:px-6">
            <AdminProfileMenu />
          </header>
          <main className="flex-1 p-4 md:p-5 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, icon: Icon, to, active = false }) {
  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-slate-900 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
          : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" /> : null}
    </Link>
  );
}
