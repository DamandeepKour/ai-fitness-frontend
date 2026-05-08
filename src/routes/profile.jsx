import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Lock, LogOut, Target } from "lucide-react";

function ProfilePage() {
  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Profile</h1>
      </header>

      <Card className="rounded-3xl border-0 p-6 mb-5 text-white" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-semibold">
            A
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Alex Carter</h2>
            <p className="opacity-80 text-sm">alex.carter@vital.app</p>
            <p className="text-xs opacity-80 mt-1">Member since Jan 2025</p>
          </div>
          <Button variant="secondary" className="rounded-full bg-white/15 hover:bg-white/25 text-white border-0">
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat label="Weight" value="72.4 kg" />
          <Stat label="Height" value="178 cm" />
          <Stat label="Age" value="28" />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="glass-card rounded-3xl p-6 border-0">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Daily Goals</h3>
          </div>
          <div className="space-y-3">
            <Field label="Calorie target (kcal)" defaultValue="2200" />
            <Field label="Protein (g)" defaultValue="140" />
            <Field label="Steps" defaultValue="10000" />
            <Field label="Water (L)" defaultValue="2.5" />
          </div>
          <Button className="mt-5 rounded-xl w-full">Save goals</Button>
        </Card>

        <div className="space-y-5">
          <Card className="glass-card rounded-3xl border-0 p-6">
            <h3 className="font-semibold mb-4">Preferences</h3>
            <Row icon={<Bell className="h-4 w-4" />} title="Notifications" desc="Meal reminders & coaching" />
            <Row icon={<Lock className="h-4 w-4" />} title="Privacy" desc="Data and sharing controls" />
            <Row icon={<LogOut className="h-4 w-4" />} title="Sign out" desc="End session on this device" />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur px-4 py-3">
      <p className="text-[11px] opacity-80">{label}</p>
      <p className="text-lg font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function Field({ label, defaultValue }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} className="mt-1.5 h-11 rounded-xl" />
    </div>
  );
}

function Row({ icon, title, desc }) {
  return (
    <button className="w-full flex items-center gap-3 py-3 border-b border-border/60 last:border-0 text-left hover:bg-accent/40 -mx-2 px-2 rounded-xl transition-colors">
      <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <span className="text-muted-foreground">›</span>
    </button>
  );
}

export default ProfilePage;
