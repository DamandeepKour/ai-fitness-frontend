import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { MobileAppHeader } from "./MobileAppHeader";

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell-main">
        <MobileAppHeader />
        <main className="app-shell-content">
          <div className="max-w-7xl mx-auto mobile-app-content">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
