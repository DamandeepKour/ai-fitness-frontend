import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "@/lib/auth-token";

/** Superadmin shell — extend with role checks when backend supports it. */
export default function SuperAdminLayout() {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Superadmin</p>
        <h1 className="text-lg font-semibold">Control panel</h1>
      </header>
      <main className="p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
