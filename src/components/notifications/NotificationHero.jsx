import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

export function NotificationHero({ title, subtitle, icon: Icon = Bell }) {
  return (
    <Card className="rounded-3xl border-0 p-6 mb-5 text-white" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm opacity-80">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}
