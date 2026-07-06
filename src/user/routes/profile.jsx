import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { getStoredUser, updateStoredUser } from "@/lib/auth-token";
import API from "@/api/axios";
import {
  Bell,
  Lock,
  LogOut,
  Target,
  Camera,
  History,
  PlusCircle,
  Sparkles,
  HeartPulse,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { ProfileCoverBackground } from "@/components/profile/ProfileCoverBackground";
import { getProfileAvatarUrl, normalizeProfileUser } from "@/lib/profile-cover";

const defaultProfile = {
  name: "",
  email: "",
  password: "",
  weight: "",
  height: "",
  age: "",
  gender: "",
  mobile_number: "",
  country_code: "+91",
  goal: "",
  diet_type: "",
  activity_level: "",
  language: "en",
  profileImageUrl: "",
  created_at: "",
};

const countries = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+971", label: "UAE (+971)" },
];

function dietLabel(v) {
  const map = {
    veg: "Vegetarian",
    veg_egg: "Vegetarian + egg",
    "non veg": "Non-vegetarian",
    non_veg: "Non-vegetarian",
  };
  return map[v] || (v ? String(v).replace(/_/g, " ") : "—");
}

function activityLabel(v) {
  const map = { low: "Light", medium: "Moderate", high: "Active" };
  return map[v] || (v ? String(v).replace(/_/g, " ") : "—");
}

function goalLabel(v) {
  if (!v) return "—";
  return String(v).replace(/_/g, " ");
}

function memberSinceText(createdAt) {
  if (!createdAt) return "Member since Jan 2025";
  try {
    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return "Member since Jan 2025";
    return `Member since ${d.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
  } catch {
    return "Member since Jan 2025";
  }
}

function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(() => ({
    ...defaultProfile,
    ...(getStoredUser() || {}),
  }));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({ ...defaultProfile, ...(getStoredUser() || {}) }));
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const res = await API.get("/user/me");
        if (ignore || !res.data?.data) return;
        const user = normalizeProfileUser(res.data.data);
        setProfile((prev) => ({ ...prev, ...user }));
        updateStoredUser(user);
      } catch {
        if (!ignore) setProfileMessage("Unable to load latest profile right now.");
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const openEdit = () => {
    setDraft({ ...profile, password: "" });
    setOpen(true);
  };

  const handleSaveProfile = async (data) => {
    setSavingProfile(true);
    setProfileMessage("");

    const payload = {
      name: data.name,
      email: data.email,
      mobile_number: data.mobile_number,
      country_code: data.country_code,
      age: Number(data.age) || null,
      gender: data.gender,
      height: Number(data.height) || null,
      weight: Number(data.weight) || null,
      goal: data.goal,
      diet_type: data.diet_type,
      activity_level: data.activity_level,
      language: data.language,
      ...(data.password ? { password: data.password } : {}),
    };

    try {
      const res = await API.put("/user/update", payload);
      const updated = normalizeProfileUser(res.data?.data || payload);

      setProfile((prev) => {
        const next = {
          ...prev,
          ...updated,
          profileImageUrl: data.profileImageUrl || updated.profileImageUrl,
        };
        if (
          prev.profileImageUrl?.startsWith("blob:") &&
          prev.profileImageUrl !== next.profileImageUrl
        ) {
          URL.revokeObjectURL(prev.profileImageUrl);
        }
        return next;
      });
      updateStoredUser(updated);
      setProfileMessage("Profile updated successfully.");
      setOpen(false);
    } catch {
      setProfileMessage("Unable to update profile right now.");
    } finally {
      setSavingProfile(false);
    }
  };

  const save = () => {
    void handleSaveProfile({ ...draft });
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    setDraft((d) => {
      if (d.profileImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(d.profileImageUrl);
      }
      return { ...d, profileImageUrl: URL.createObjectURL(file) };
    });
  };

  const initials = profile.name
    ? profile.name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <AppShell>
      <MobileProfileView
        profile={profile}
        initials={initials}
        message={profileMessage}
        onEdit={openEdit}
        onLogout={logout}
      />

      <div className="hidden md:block">
        <header className="mb-6">
          <p className="text-sm text-muted-foreground">Account</p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-1">Profile</h1>
          {profileMessage ? (
            <p className="text-sm text-muted-foreground mt-2">{profileMessage}</p>
          ) : null}
        </header>

        <Card
          className="rounded-3xl border-0 p-6 md:p-8 mb-5 text-white relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 backdrop-blur rounded-full px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> Personal wellness profile
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold mt-3 max-w-md">
              Stay committed to your healthiest self.
            </h2>
            <p className="opacity-85 text-sm mt-2 inline-flex items-center gap-2">
              <HeartPulse className="h-4 w-4" />
              Keep your goals updated and track your daily discipline.
            </p>
          </div>
        </Card>

        <Card className="glass-card rounded-3xl border-0 p-6 mb-5">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl font-semibold overflow-hidden text-primary">
              {getProfileAvatarUrl(profile) ? (
                <img
                  src={getProfileAvatarUrl(profile)}
                  alt={profile.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate">{profile.name || "Your name"}</h2>
              <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" /> {profile.email || "—"}
              </p>
              {profile.mobile_number ? (
                <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5" /> {profile.country_code} {profile.mobile_number}
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                <Calendar className="h-3 w-3" /> {memberSinceText(profile.created_at)}
              </p>
            </div>
            <Button type="button" onClick={openEdit} className="rounded-full">
              Edit profile
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <Stat label="Weight" value={profile.weight ? `${profile.weight} kg` : "—"} />
            <Stat label="Height" value={profile.height ? `${profile.height} cm` : "—"} />
            <Stat label="Age" value={profile.age ? String(profile.age) : "—"} />
            <Stat label="Gender" value={profile.gender || "—"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Tag label="Goal" value={goalLabel(profile.goal)} />
            <Tag label="Diet" value={dietLabel(profile.diet_type)} />
            <Tag label="Activity" value={activityLabel(profile.activity_level)} />
          </div>
        </Card>

        <Card className="glass-card rounded-3xl border-0 mb-5 overflow-hidden">
          <button
            type="button"
            onClick={() => setGoalsOpen((v) => !v)}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/40 transition-colors"
          >
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Daily goals</p>
              <p className="text-xs text-muted-foreground">Calories, protein, steps & water</p>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${goalsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {goalsOpen ? (
            <div className="px-5 pb-5 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Calorie target (kcal)" defaultValue="2200" />
                <Field label="Protein (g)" defaultValue="140" />
                <Field label="Steps" defaultValue="10000" />
                <Field label="Water (L)" defaultValue="2.5" />
              </div>
              <Button type="button" className="rounded-xl mt-4 w-full md:w-auto">
                Save goals
              </Button>
            </div>
          ) : null}
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <ActionTile
            to="/meal-history"
            icon={<History className="h-5 w-5" />}
            title="Meal history"
            desc="Today, 7 days, or monthly views"
            accent="from-amber-500/15 to-orange-500/5"
            iconClass="bg-amber-500/15 text-amber-600 dark:text-amber-400"
          />
          <ActionTile
            to="/notifications"
            icon={<Bell className="h-5 w-5" />}
            title="Notifications"
            desc="Meal reminders & coaching"
            accent="from-sky-500/15 to-blue-500/5"
            iconClass="bg-sky-500/15 text-sky-600 dark:text-sky-400"
          />
          <ActionTile
            to="/privacy"
            icon={<Lock className="h-5 w-5" />}
            title="Privacy"
            desc="Data and sharing controls"
            accent="from-emerald-500/15 to-teal-500/5"
            iconClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          />
          <ActionTile
            icon={<LogOut className="h-5 w-5" />}
            title="Sign out"
            desc="End session on this device"
            accent="from-rose-500/15 to-red-500/5"
            iconClass="bg-rose-500/15 text-rose-600 dark:text-rose-400"
            destructive
            footerLabel="Sign out"
            onActivate={logout}
          />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your photo and personal details.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative h-20 w-20 rounded-2xl bg-accent overflow-hidden flex items-center justify-center text-2xl font-semibold group shrink-0"
            >
              {draft.profileImageUrl ? (
                <img
                  src={draft.profileImageUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{draft.name?.charAt(0) || "?"}</span>
              )}
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="h-5 w-5" />
              </span>
            </button>
            <div>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={() => fileRef.current?.click()}
              >
                <Camera className="h-4 w-4" /> Change photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">PNG or JPG, up to 5 MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onPickFile} />
          </div>
          <div className="grid gap-3 mt-2">
            <DraftField label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <DraftField
              label="Email"
              value={draft.email}
              onChange={(v) => setDraft({ ...draft, email: v })}
              type="email"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Country</Label>
                <select
                  value={draft.country_code}
                  onChange={(e) => setDraft({ ...draft, country_code: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <DraftField
                label="Mobile"
                value={draft.mobile_number}
                onChange={(v) => setDraft({ ...draft, mobile_number: v })}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <DraftField
                label="Weight (kg)"
                value={draft.weight}
                onChange={(v) => setDraft({ ...draft, weight: v })}
                type="number"
              />
              <DraftField
                label="Height (cm)"
                value={draft.height}
                onChange={(v) => setDraft({ ...draft, height: v })}
                type="number"
              />
              <DraftField label="Age" value={draft.age} onChange={(v) => setDraft({ ...draft, age: v })} type="number" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <DraftSelect
                label="Gender"
                value={draft.gender}
                onChange={(v) => setDraft({ ...draft, gender: v })}
                options={["Female", "Male", "Other"]}
              />
              <DraftSelect
                label="Goal"
                value={draft.goal}
                onChange={(v) => setDraft({ ...draft, goal: v })}
                options={["fat_loss", "weight_loss", "maintenance", "muscle_gain"]}
                formatOption={(o) => o.replace(/_/g, " ")}
              />
              <DraftSelect
                label="Diet"
                value={draft.diet_type}
                onChange={(v) => setDraft({ ...draft, diet_type: v })}
                options={["veg", "veg_egg", "non veg"]}
                formatOption={(o) => dietLabel(o)}
              />
              <DraftSelect
                label="Activity"
                value={draft.activity_level}
                onChange={(v) => setDraft({ ...draft, activity_level: v })}
                options={["low", "medium", "high"]}
                formatOption={(o) => activityLabel(o)}
              />
              <DraftSelect
                label="Coaching language"
                value={draft.language || "en"}
                onChange={(v) => setDraft({ ...draft, language: v })}
                options={["en", "hi", "hi-en"]}
                formatOption={(o) => ({ en: "English", hi: "Hindi", "hi-en": "Hindi + English" }[o] || o)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">New password</Label>
              <Input
                type="password"
                value={draft.password}
                placeholder="Leave blank to keep current"
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="button" onClick={save} className="rounded-full" disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function MobileProfileView({ profile, initials, message, onEdit, onLogout }) {
  const avatarUrl = getProfileAvatarUrl(profile);

  return (
    <section className="md:hidden -mx-4 -mt-2 min-h-[calc(100dvh-9rem)] bg-slate-50 dark:bg-slate-950">
      <ProfileCoverBackground
        user={profile}
        className="rounded-b-[2rem] px-5 pb-8 pt-6 text-white shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 shadow-2xl ring-2 ring-white/10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary to-violet-500 text-3xl font-semibold">
                {initials}
              </div>
            )}
          </div>

          <h1 className="mt-4 max-w-full truncate text-xl font-semibold drop-shadow-sm">
            {profile.name || "Your profile"}
          </h1>
          <p className="mt-1 max-w-full truncate text-sm text-white/80">{profile.email || "Manage your account"}</p>
          {profile.mobile_number ? (
            <p className="mt-1 text-xs text-white/65">
              {profile.country_code} {profile.mobile_number}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onEdit}
            className="mt-5 rounded-full border border-white/25 bg-white px-5 py-2 text-sm font-semibold text-slate-950 shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </ProfileCoverBackground>

      <div className="px-4 pb-6 pt-5">
        {message ? (
          <p className="mb-3 rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm dark:bg-slate-900">
            {message}
          </p>
        ) : null}

        <div className="rounded-[1.75rem] bg-white p-2 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
          <MobileMenuRow
            to="/add"
            icon={<PlusCircle className="h-5 w-5" />}
            title="Log"
            subtitle="Add today's meal"
            iconClass="bg-primary/10 text-primary"
          />
          <MobileMenuRow
            to="/meal-history"
            icon={<History className="h-5 w-5" />}
            title="Log history"
            subtitle="Review meals and nutrition"
            iconClass="bg-amber-500/15 text-amber-600 dark:text-amber-300"
          />
          <MobileMenuRow
            to="/notifications"
            icon={<Bell className="h-5 w-5" />}
            title="Notifications"
            subtitle="Reminders and coaching alerts"
            iconClass="bg-sky-500/15 text-sky-600 dark:text-sky-300"
          />
          <MobileMenuRow
            to="/privacy"
            icon={<Lock className="h-5 w-5" />}
            title="Privacy"
            subtitle="Data and account controls"
            iconClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
          />
          <MobileMenuRow
            asButton
            icon={<LogOut className="h-5 w-5" />}
            title="Logout"
            subtitle="Sign out from this device"
            iconClass="bg-rose-500/15 text-rose-600 dark:text-rose-300"
            titleClass="text-destructive"
            onClick={onLogout}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MobileStat label="Weight" value={profile.weight ? `${profile.weight}kg` : "—"} />
          <MobileStat label="Goal" value={goalLabel(profile.goal)} />
          <MobileStat label="Activity" value={activityLabel(profile.activity_level)} />
        </div>
      </div>
    </section>
  );
}

function MobileMenuRow({ asButton, to, icon, title, subtitle, iconClass, titleClass = "", onClick }) {
  const content = (
    <>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${iconClass}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-semibold ${titleClass}`}>{title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </>
  );

  const className = "flex w-full items-center gap-3 rounded-3xl px-3 py-3 text-left transition-colors hover:bg-accent/70";

  if (asButton) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
}

function MobileStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
      <p className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-accent/60 px-4 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-base font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function Tag({ label, value }) {
  return (
    <div className="rounded-2xl border border-border/60 px-4 py-3 flex items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-right truncate">{value}</p>
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

function DraftField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 rounded-xl"
      />
    </div>
  );
}

function DraftSelect({ label, value, onChange, options, formatOption }) {
  const fmt = formatOption || ((o) => o.replace(/_/g, " "));
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {fmt(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActionTile({ icon, title, desc, to, destructive, accent, iconClass, onActivate, footerLabel = "Open" }) {
  const content = (
    <div className="relative h-full glass-card rounded-3xl border-0 p-5 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70 pointer-events-none`} />
      <div className="relative flex flex-col h-full min-h-[140px]">
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${iconClass}`}>{icon}</div>
        <div className="mt-4 flex-1">
          <p className={`font-semibold ${destructive ? "text-destructive" : ""}`}>{title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium mt-4 opacity-80">
          {footerLabel} <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="block h-full text-left w-full" onClick={onActivate}>
      {content}
    </button>
  );
}

export default ProfilePage;
