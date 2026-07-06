import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationHero } from "@/components/notifications/NotificationHero";
import { NotificationPreferenceRow } from "@/components/notifications/NotificationPreferenceRow";
import { QuietHoursCard } from "@/components/notifications/QuietHoursCard";
import {
  getNotificationPrefsRequest,
  updateNotificationPrefsRequest,
} from "@/api/notifications";
import { ChevronLeft, Dumbbell, Utensils, Trophy, Droplets, Moon, Sparkles } from "lucide-react";

const PREF_META = [
  { key: "meal_reminders", title: "Meal reminders", desc: "Breakfast, lunch & dinner nudges", icon: Utensils },
  { key: "water_reminders", title: "Water reminders", desc: "Hourly hydration check-ins", icon: Droplets },
  { key: "coaching_tips", title: "AI coaching tips", desc: "Personalized daily insights", icon: Sparkles },
  { key: "goal_milestones", title: "Goal milestones", desc: "Celebrate streaks and PRs", icon: Trophy },
  { key: "wind_down", title: "Wind-down", desc: "Evening summary at 9:30 PM", icon: Moon },
];

const WORKOUT_OPTIONS = [
  { value: "daily", title: "Daily workouts", desc: "One focused session each day" },
  { value: "weekly", title: "Weekly workouts", desc: "Full week training schedule" },
];

function formatTime12h(value) {
  if (!value) return "";
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function NotificationsPage() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [message, setMessage] = useState("");
  const [quietOpen, setQuietOpen] = useState(false);
  const [quietDraft, setQuietDraft] = useState({ quiet_start: "22:00", quiet_end: "07:00" });

  const loadPrefs = useCallback(async () => {
    const data = await getNotificationPrefsRequest();
    setPrefs(data);
    setQuietDraft({
      quiet_start: data?.quiet_start || "22:00",
      quiet_end: data?.quiet_end || "07:00",
    });
  }, []);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const data = await getNotificationPrefsRequest();
        if (ignore) return;
        setPrefs(data);
        setQuietDraft({
          quiet_start: data?.quiet_start || "22:00",
          quiet_end: data?.quiet_end || "07:00",
        });
      } catch {
        if (!ignore) setMessage("Unable to load notification preferences.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  const quietHoursDescription = useMemo(() => {
    if (!prefs) return "No notifications during your quiet hours.";
    return `No notifications between ${formatTime12h(prefs.quiet_start)} and ${formatTime12h(prefs.quiet_end)}.`;
  }, [prefs]);

  const persistUpdate = useCallback(async (payload, key = "") => {
    setSavingKey(key);
    setMessage("");

    try {
      const data = await updateNotificationPrefsRequest(payload);
      setPrefs(data);
    } catch {
      setMessage("Could not save your preference. Please try again.");
      await loadPrefs();
    } finally {
      setSavingKey("");
    }
  }, [loadPrefs]);

  const togglePref = useCallback(async (key) => {
    if (!prefs) return;
    const nextValue = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: nextValue }));
    await persistUpdate({ [key]: nextValue }, key);
  }, [prefs, persistUpdate]);

  const setWorkoutPlanType = useCallback(async (value) => {
    if (!prefs || prefs.workout_plan_type === value) return;
    setPrefs((prev) => ({ ...prev, workout_plan_type: value }));
    await persistUpdate({ workout_plan_type: value }, "workout_plan_type");
  }, [prefs, persistUpdate]);

  const openQuietHours = useCallback(() => {
    setQuietDraft({
      quiet_start: prefs?.quiet_start || "22:00",
      quiet_end: prefs?.quiet_end || "07:00",
    });
    setQuietOpen(true);
  }, [prefs]);

  const saveQuietHours = useCallback(async () => {
    await persistUpdate(quietDraft, "quiet_hours");
    setQuietOpen(false);
    setMessage("Quiet hours updated.");
  }, [persistUpdate, quietDraft]);

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

      {loading ? (
        <Card className="glass-card rounded-3xl border-0 p-6">
          <p className="text-sm text-muted-foreground">Loading preferences...</p>
        </Card>
      ) : (
        <>
          <Card className="glass-card rounded-3xl border-0 p-2">
            {PREF_META.map((item, index) => {
              const Icon = item.icon;
              return (
                <NotificationPreferenceRow
                  key={item.key}
                  title={item.title}
                  description={item.desc}
                  icon={<Icon className="h-4 w-4" />}
                  checked={Boolean(prefs?.[item.key])}
                  disabled={savingKey === item.key}
                  onCheckedChange={() => togglePref(item.key)}
                  showDivider={index !== PREF_META.length - 1}
                />
              );
            })}
          </Card>

          <Card className="glass-card rounded-3xl border-0 p-2 mt-5">
            <div className="px-4 py-4 border-b border-border/60">
              <p className="font-medium text-sm inline-flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                Workout schedule
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Choose how workout plans and reminders are generated for you.
              </p>
            </div>
            {WORKOUT_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setWorkoutPlanType(option.value)}
                disabled={savingKey === "workout_plan_type"}
                className={`w-full text-left px-4 py-4 transition-colors ${
                  index !== WORKOUT_OPTIONS.length - 1 ? "border-b border-border/60" : ""
                } ${prefs?.workout_plan_type === option.value ? "bg-primary/5" : "hover:bg-accent/40"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{option.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 shrink-0 ${
                      prefs?.workout_plan_type === option.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  />
                </div>
              </button>
            ))}
          </Card>

          <QuietHoursCard
            title="Quiet hours"
            description={quietHoursDescription}
            onAction={openQuietHours}
          />
        </>
      )}

      {message ? <p className="text-sm text-muted-foreground mt-4">{message}</p> : null}

      <Dialog open={quietOpen} onOpenChange={setQuietOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quiet hours</DialogTitle>
            <DialogDescription>
              Notifications will be paused during this window.
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-2">
            <div>
              <Label htmlFor="quiet_start" className="text-xs text-muted-foreground">Start time</Label>
              <Input
                id="quiet_start"
                type="time"
                value={quietDraft.quiet_start}
                onChange={(event) => setQuietDraft((prev) => ({ ...prev, quiet_start: event.target.value }))}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="quiet_end" className="text-xs text-muted-foreground">End time</Label>
              <Input
                id="quiet_end"
                type="time"
                value={quietDraft.quiet_end}
                onChange={(event) => setQuietDraft((prev) => ({ ...prev, quiet_end: event.target.value }))}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="rounded-full" onClick={() => setQuietOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="rounded-full" onClick={saveQuietHours} disabled={savingKey === "quiet_hours"}>
              {savingKey === "quiet_hours" ? "Saving..." : "Save schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default NotificationsPage;
