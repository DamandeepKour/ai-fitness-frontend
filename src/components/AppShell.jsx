import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-10 py-6 md:py-10 pb-28 md:pb-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
