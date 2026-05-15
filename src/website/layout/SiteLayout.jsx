import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/website/components/site/SiteHeader";
import { SiteFooter } from "@/website/components/site/SiteFooter";

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
