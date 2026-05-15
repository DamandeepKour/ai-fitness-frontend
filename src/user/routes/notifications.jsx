import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationHero } from "@/components/notifications/NotificationHero";
import { NotificationPreferenceRow } from "@/components/notifications/NotificationPreferenceRow";
import { QuietHoursCard } from "@/components/notifications/QuietHoursCard";
import { ChevronLeft, Utensils, Trophy, Droplets, Moon, Sparkles } from "lucide-react";

const DEFAULT_PREFS = [
  { key: "meals", title: "Meal reminders", desc: "Breakfast, lunch & dinner nudges", icon: Utensils, on: true },
  { key: "water", title: "Water reminders", desc: "Hourly hydration check-ins", icon: Droplets, on: true },
  { key: "coach", title: "AI coaching tips", desc: "Personalized daily insights", icon: Sparkles, on: true },
  { key: "goals", title: "Goal milestones", desc: "Celebrate streaks and PRs", icon: Trophy, on: false },
  { key: "sleep", title: "Wind-down", desc: "Evening summary at 9:30 PM", icon: Moon, on: false },
];

function NotificationsPage() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const toggle = useCallback((key) => {
    setPrefs((prev) => prev.map((x) => (x.key === key ? { ...x, on: !x.on } : x)));
  }, []);

  const handleQuietHours = useCallback(() => {
    // Wire to a time-picker modal or route when ready.
  }, []);

  return (
    <AppShell>
      <header className="mb-8">
        <Button variant="ghost" size="sm" className="-ml-2 mb-3 h-auto px-2 py-1 text-muted-foreground hover:text-foreground" asChild>
          <Link to="/profile" className="inline-flex items-center gap-1 text-sm">
            <ChevronLeft className="h-4 w-4" />
            Back to profile
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">Preferences</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Notifications</h1>
      </header>

      <NotificationHero
        title="Stay on track"
        subtitle="We'll only ping you for things that matter."
      />

      <Card className="glass-card rounded-3xl border-0 p-2">
        {prefs.map((p, i) => {
          const Icon = p.icon;
          return (
            <NotificationPreferenceRow
              key={p.key}
              title={p.title}
              description={p.desc}
              icon={<Icon className="h-4 w-4" />}
              checked={p.on}
              onCheckedChange={() => toggle(p.key)}
              showDivider={i !== prefs.length - 1}
            />
          );
        })}
      </Card>

      <QuietHoursCard
        title="Quiet hours"
        description="No notifications between 10:00 PM and 7:00 AM."
        onAction={handleQuietHours}
      />
    </AppShell>
  );
}

export default NotificationsPage;
