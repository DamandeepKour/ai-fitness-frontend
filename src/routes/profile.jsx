import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Bell, Lock, LogOut, Target, Sparkles, HeartPulse } from "lucide-react";

const defaultProfile = {
  name: "Alex Carter",
  email: "alex.carter@vital.app",
  weight: "72.4",
  height: "178",
  age: "28",
  profileImageUrl: "",
};

function ProfilePage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

  const handleSaveProfile = (data) => {
    setProfile((prev) => {
      const next = { ...data };
      if (
        prev.profileImageUrl?.startsWith("blob:") &&
        prev.profileImageUrl !== next.profileImageUrl
      ) {
        URL.revokeObjectURL(prev.profileImageUrl);
      }
      return next;
    });
  };

  const handleChangePhoto = (file) => {
    // Optional: upload `file` to your API here; the modal already shows a local preview.
    void file;
  };

  const displayInitials = profile.name
    ? profile.name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Profile</h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5"
      >
        <Card className="rounded-3xl border border-border overflow-hidden text-white shadow-lg dark:shadow-black/30">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1600&q=80"
              alt="Healthy lifestyle and wellbeing"
              className="h-48 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/35" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <p className="inline-flex w-fit items-center gap-1.5 text-xs bg-white/20 rounded-full px-2.5 py-1">
                <Sparkles className="h-3 w-3" /> Personal wellness profile
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Stay committed to your healthiest self.</h2>
              <p className="text-sm text-white/90 mt-2 inline-flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                Keep your goals updated and track your daily discipline.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

        <Card
          className="mb-5 rounded-3xl border border-border p-6 text-white shadow-lg dark:shadow-black/30"
          style={{ background: "var(--gradient-hero)" }}
        >
        <div className="flex items-center gap-5">
          {profile.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover border border-white/30"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-semibold">
              {displayInitials}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="opacity-80 text-sm">{profile.email}</p>
            <p className="text-xs opacity-80 mt-1">Member since Jan 2025</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="rounded-full bg-white/15 px-4 text-white shadow-sm ring-1 ring-white/25 hover:bg-white/25 dark:ring-white/20"
            onClick={() => setIsEditProfileOpen(true)}
          >
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat label="Weight" value={`${profile.weight} kg`} />
          <Stat label="Height" value={`${profile.height} cm`} />
          <Stat label="Age" value={profile.age} />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="glass-card rounded-3xl p-6">
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
          <Card className="glass-card rounded-3xl p-6">
            <h3 className="font-semibold mb-4">Preferences</h3>
            <Row icon={<Bell className="h-4 w-4" />} title="Notifications" desc="Meal reminders & coaching" />
            <Row icon={<Lock className="h-4 w-4" />} title="Privacy" desc="Data and sharing controls" />
            <Row icon={<LogOut className="h-4 w-4" />} title="Sign out" desc="End session on this device" />
          </Card>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        initialData={profile}
        onSave={handleSaveProfile}
        onChangePhoto={handleChangePhoto}
      />
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
    <button className="w-full flex items-center gap-3 py-3 border-b border-border last:border-0 text-left hover:bg-accent/40 -mx-2 px-2 rounded-xl transition-colors">
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
