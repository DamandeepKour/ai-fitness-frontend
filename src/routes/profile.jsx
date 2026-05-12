import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/EditProfileModal";
import { useAuth } from "@/hooks/use-auth";
import { getStoredUser } from "@/lib/auth-token";
import {
  Bell,
  Lock,
  LogOut,
  Target,
  Sparkles,
  HeartPulse,
  History,
  ChevronDown,
} from "lucide-react";

const defaultProfile = {
  name: "Alex Carter",
  email: "alex.carter@vital.app",
  weight: "72.4",
  height: "178",
  age: "28",
  profileImageUrl: "",
};

function ProfilePage() {
  const { logout } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    const stored = getStoredUser();
    return {
      ...defaultProfile,
      ...(stored?.name ? { name: stored.name } : {}),
      ...(stored?.email ? { email: stored.email } : {}),
    };
  });
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

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

      {/* Hero Banner — col-12 */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 w-full"
      >
        <Card className="rounded-3xl border border-border overflow-hidden text-white shadow-lg dark:shadow-black/30 w-full">
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
              <h2 className="mt-3 text-2xl font-semibold">
                Stay committed to your healthiest self.
              </h2>
              <p className="text-sm text-white/90 mt-2 inline-flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                Keep your goals updated and track your daily discipline.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Profile Card — col-12 */}
      <Card
        className="mb-5 rounded-3xl border border-border p-6 text-white shadow-lg dark:shadow-black/30 w-full"
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

      {/* Daily Goals — col-12, collapsible dropdown */}
      <Card className="glass-card rounded-3xl w-full mb-5 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsGoalsOpen((v) => !v)}
          className="w-full flex items-center gap-3 p-6 text-left hover:bg-accent/30 transition-colors"
        >
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Daily Goals</p>
            <p className="text-xs text-muted-foreground">
              Calories, protein, steps & water
            </p>
          </div>
          <motion.span
            animate={{ rotate: isGoalsOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isGoalsOpen && (
            <motion.div
              key="goals-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0 space-y-3">
                <div className="h-px bg-border mb-4" />
                <Field label="Calorie target (kcal)" defaultValue="2200" />
                <Field label="Protein (g)" defaultValue="140" />
                <Field label="Steps" defaultValue="10000" />
                <Field label="Water (L)" defaultValue="2.5" />
                <Button className="mt-3 rounded-xl w-full">Save goals</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Meal History — col-12 */}
      <Card className="glass-card rounded-3xl w-full mb-5">
        <Link
          to="/meal-history"
          className="w-full flex items-center gap-3 p-6 text-left hover:bg-accent/40 transition-colors rounded-3xl"
        >
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
            <History className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Meal history</p>
            <p className="text-xs text-muted-foreground">
              Today, 7 days, or monthly views
            </p>
          </div>
          <span className="text-muted-foreground shrink-0">›</span>
        </Link>
      </Card>

      {/* Notifications — col-12 */}
      <Card className="glass-card rounded-3xl w-full mb-5">
        <Link
          to="/notifications"
          className="w-full flex items-center gap-3 p-6 text-left hover:bg-accent/40 transition-colors rounded-3xl"
        >
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
            <Bell className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Meal reminders &amp; coaching
            </p>
          </div>
          <span className="text-muted-foreground shrink-0">›</span>
        </Link>
      </Card>

      {/* Privacy — col-12 */}
      <Card className="glass-card rounded-3xl w-full mb-5">
        <Link
          to="/privacy"
          className="w-full flex items-center gap-3 p-6 text-left hover:bg-accent/40 transition-colors rounded-3xl"
        >
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
            <Lock className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Privacy</p>
            <p className="text-xs text-muted-foreground">
              Data and sharing controls
            </p>
          </div>
          <span className="text-muted-foreground shrink-0">›</span>
        </Link>
      </Card>

      {/* Sign Out — col-12 */}
      <Card className="glass-card rounded-3xl w-full mb-5">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 p-6 text-left hover:bg-accent/40 transition-colors rounded-3xl"
        >
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
            <LogOut className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Sign out</p>
            <p className="text-xs text-muted-foreground">
              End session on this device
            </p>
          </div>
          <span className="text-muted-foreground">›</span>
        </button>
      </Card>

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

export default ProfilePage;