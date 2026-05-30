import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/shared";
import { getSuperadminMeRequest, updateSuperadminProfileRequest } from "@/api/user";
import { getProfileCompletion } from "@/lib/profile-completion";
import { updateStoredUser } from "@/lib/auth-token";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  mobile_number: "",
  country_code: "+91",
  age: "",
  gender: "",
  height: "",
  weight: "",
  goal: "",
  diet_type: "",
  activity_level: "",
  language: "",
};

const countries = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+971", label: "UAE (+971)" },
];

export default function SuperAdminMyProfile() {
  const [searchParams] = useSearchParams();
  const focusComplete = searchParams.get("complete") === "1";

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const user = await getSuperadminMeRequest();
        if (ignore || !user) return;
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
          mobile_number: user.mobile_number || "",
          country_code: user.country_code || "+91",
          age: user.age ?? "",
          gender: user.gender || "",
          height: user.height ?? "",
          weight: user.weight ?? "",
          goal: user.goal || "",
          diet_type: user.diet_type || "",
          activity_level: user.activity_level || "",
          language: user.language || "",
        });
        updateStoredUser(user);
      } catch {
        if (!ignore) setError("Unable to load your profile.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const completion = useMemo(() => getProfileCompletion(form), [form]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile_number: form.mobile_number.trim(),
      country_code: form.country_code,
      age: Number(form.age) || null,
      gender: form.gender,
      height: Number(form.height) || null,
      weight: Number(form.weight) || null,
      goal: form.goal,
      diet_type: form.diet_type,
      activity_level: form.activity_level,
      language: form.language || null,
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      const updated = await updateSuperadminProfileRequest(payload);
      updateStoredUser(updated);
      setForm((prev) => ({ ...prev, ...updated, password: "" }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        title="My profile"
        subtitle="Update your superadmin account details."
      />

      {focusComplete && !completion.isComplete ? (
        <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">Complete your profile</p>
          <p className="text-xs text-amber-800 mt-1">
            Missing: {completion.missing.join(", ")} ({completion.percent}% done)
          </p>
        </Card>
      ) : null}

      {error ? (
        <Card className="rounded-2xl border border-destructive/30 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      ) : null}

      {message ? (
        <Card className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">{message}</p>
        </Card>
      ) : null}

      <Card className="rounded-2xl border border-slate-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : (
          <form onSubmit={handleSave} className="grid gap-4 max-w-2xl">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Country</Label>
                <select
                  value={form.country_code}
                  onChange={(e) => setForm({ ...form, country_code: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Mobile"
                value={form.mobile_number}
                onChange={(v) => setForm({ ...form, mobile_number: v })}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Age" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
              <SelectField
                label="Gender"
                value={form.gender}
                options={["Female", "Male", "Other"]}
                onChange={(v) => setForm({ ...form, gender: v })}
              />
              <Field
                label="Language"
                value={form.language}
                onChange={(v) => setForm({ ...form, language: v })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Height (cm)"
                type="number"
                value={form.height}
                onChange={(v) => setForm({ ...form, height: v })}
              />
              <Field
                label="Weight (kg)"
                type="number"
                value={form.weight}
                onChange={(v) => setForm({ ...form, weight: v })}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <SelectField
                label="Goal"
                value={form.goal}
                options={["fat_loss", "weight_loss", "maintenance", "muscle_gain"]}
                format={(o) => o.replace(/_/g, " ")}
                onChange={(v) => setForm({ ...form, goal: v })}
              />
              <SelectField
                label="Diet"
                value={form.diet_type}
                options={["veg", "veg_egg", "non veg"]}
                onChange={(v) => setForm({ ...form, diet_type: v })}
              />
              <SelectField
                label="Activity"
                value={form.activity_level}
                options={["low", "medium", "high"]}
                onChange={(v) => setForm({ ...form, activity_level: v })}
              />
            </div>

            <Field
              label="New password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              placeholder="Leave blank to keep current"
            />

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-rose-500"
            >
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </form>
        )}
      </Card>
    </AdminShell>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 rounded-xl"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange, format }) {
  const fmt = format || ((o) => o);
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
