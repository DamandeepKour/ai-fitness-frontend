import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  connectWearableRequest,
  disconnectWearableRequest,
  getGroceryListRequest,
  getPremiumOverviewRequest,
  requestCoachReviewRequest,
  saveFamilyPlanRequest,
  sendWhatsAppDemoRequest,
  submitLabReportRequest,
  updateNotificationPrefsRequest,
} from "@/api/premium";
import {
  Activity,
  ChevronLeft,
  Crown,
  FileText,
  MessageCircle,
  ShoppingBag,
  Stethoscope,
  Users,
  Watch,
} from "lucide-react";

export default function PremiumPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [labForm, setLabForm] = useState({ hba1c: "", vitamin_d: "", cholesterol: "", hemoglobin: "" });
  const [familyMembers, setFamilyMembers] = useState([{ name: "", age: "", goal: "weight_loss", diet_type: "veg" }]);
  const [grocery, setGrocery] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPremiumOverviewRequest();
      setOverview(data);
      if (data.family?.members?.length) {
        setFamilyMembers(data.family.members);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Premium — AIFitnova";
    load();
  }, [load]);

  async function toggleWhatsApp(enabled) {
    await updateNotificationPrefsRequest({ whatsapp_enabled: enabled ? 1 : 0 });
    await load();
  }

  async function handleWhatsAppDemo() {
    const result = await sendWhatsAppDemoRequest();
    setMessage(result.sent ? `Demo sent to ${result.to}: "${result.message}"` : result.reason);
  }

  async function handleCoachReview() {
    await requestCoachReviewRequest({ userNotes: "Please review my latest AI meal plan." });
    setMessage("Coach review requested — you'll hear back within 24 hours.");
    await load();
  }

  async function handleLabSubmit(e) {
    e.preventDefault();
    const markers = Object.fromEntries(
      Object.entries(labForm).filter(([, v]) => v !== "").map(([k, v]) => [k, Number(v)]),
    );
    const report = await submitLabReportRequest({ markers });
    setMessage(`Lab report analyzed — ${report.recommendations?.length || 0} recommendations generated.`);
    await load();
  }

  async function handleWearableConnect() {
    await connectWearableRequest("demo");
    setMessage("Wearable connected (demo mode).");
    await load();
  }

  async function handleWearableDisconnect() {
    await disconnectWearableRequest();
    await load();
  }

  async function handleFamilySave() {
    await saveFamilyPlanRequest({ name: "My Family", members: familyMembers.filter((m) => m.name) });
    setMessage("Family plan saved.");
    await load();
  }

  async function handleGrocery(partnerId) {
    const data = await getGroceryListRequest(partnerId);
    setGrocery(data);
  }

  const wearable = overview?.wearable;
  const prefs = overview?.notifications;
  const latestLab = overview?.latestLabReport;

  return (
    <AppShell>
      <header className="mb-8">
        <Button variant="ghost" size="sm" className="-ml-2 mb-3" asChild>
          <Link to="/smart" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            Smart features
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          <Crown className="h-3.5 w-3.5" />
          Premium
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Premium Features</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Coach review, family plans, WhatsApp reminders, lab-based recommendations, wearables, and grocery partnerships.
        </p>
      </header>

      {message ? (
        <Card className="glass-card rounded-2xl p-4 border-0 mb-6">
          <p className="text-sm">{message}</p>
        </Card>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-5">
        <PremiumCard icon={Stethoscope} title="Coach review" loading={loading}>
          <p className="text-sm text-muted-foreground mb-3">A certified coach reviews your AI plan and suggests tweaks.</p>
          {overview?.latestReview ? (
            <p className="text-xs rounded-full inline-block bg-amber-50 text-amber-800 px-2 py-1 mb-3 capitalize">
              Status: {overview.latestReview.status.replace(/_/g, " ")}
            </p>
          ) : null}
          <Button type="button" className="rounded-xl w-full" onClick={handleCoachReview}>
            Request coach review
          </Button>
        </PremiumCard>

        <PremiumCard icon={Users} title="Family plans" loading={loading}>
          <p className="text-sm text-muted-foreground mb-3">Add up to 6 family members with individual goals.</p>
          <div className="space-y-2 mb-3">
            {familyMembers.map((m, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <Input placeholder="Name" value={m.name} className="h-9 rounded-lg text-sm" onChange={(e) => {
                  const next = [...familyMembers];
                  next[i] = { ...next[i], name: e.target.value };
                  setFamilyMembers(next);
                }} />
                <Input placeholder="Age" type="number" value={m.age} className="h-9 rounded-lg text-sm" onChange={(e) => {
                  const next = [...familyMembers];
                  next[i] = { ...next[i], age: e.target.value };
                  setFamilyMembers(next);
                }} />
                <select className="h-9 rounded-lg border text-sm px-2" value={m.goal} onChange={(e) => {
                  const next = [...familyMembers];
                  next[i] = { ...next[i], goal: e.target.value };
                  setFamilyMembers(next);
                }}>
                  <option value="weight_loss">Lose</option>
                  <option value="muscle_gain">Gain</option>
                  <option value="maintenance">Maintain</option>
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => setFamilyMembers([...familyMembers, { name: "", age: "", goal: "weight_loss", diet_type: "veg" }])}>
              + Member
            </Button>
            <Button type="button" size="sm" className="rounded-xl flex-1" onClick={handleFamilySave}>
              Save family
            </Button>
          </div>
        </PremiumCard>

        <PremiumCard icon={MessageCircle} title="WhatsApp reminders" loading={loading}>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm">Enable WhatsApp nudges</Label>
            <Switch checked={Boolean(prefs?.whatsapp_enabled)} onCheckedChange={toggleWhatsApp} />
          </div>
          <p className="text-sm text-muted-foreground mb-3">Meal reminders on your registered mobile number.</p>
          <Button type="button" variant="secondary" className="rounded-xl w-full" onClick={handleWhatsAppDemo}>
            Send demo reminder
          </Button>
        </PremiumCard>

        <PremiumCard icon={FileText} title="Lab-report recommendations" loading={loading}>
          <form onSubmit={handleLabSubmit} className="grid grid-cols-2 gap-2 mb-3">
            {[
              ["hba1c", "HbA1c (%)"],
              ["vitamin_d", "Vitamin D"],
              ["cholesterol", "Cholesterol"],
              ["hemoglobin", "Hemoglobin"],
            ].map(([key, label]) => (
              <div key={key}>
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input value={labForm[key]} onChange={(e) => setLabForm({ ...labForm, [key]: e.target.value })} className="h-9 mt-1 rounded-lg" />
              </div>
            ))}
            <Button type="submit" className="col-span-2 rounded-xl mt-1">Analyze report</Button>
          </form>
          {latestLab?.recommendations?.[0] ? (
            <p className="text-xs text-muted-foreground border-t pt-3">
              Latest: {latestLab.recommendations[0].en}
              <br />
              <span className="text-primary/80">{latestLab.recommendations[0].hi}</span>
            </p>
          ) : null}
        </PremiumCard>

        <PremiumCard icon={Watch} title="Wearable integration" loading={loading}>
          {wearable?.status === "connected" ? (
            <div className="space-y-2 mb-3 text-sm">
              <p>Steps today: <strong>{wearable.steps_today?.toLocaleString()}</strong></p>
              <p>Sleep: <strong>{wearable.sleep_hours}h</strong> · HR: <strong>{wearable.heart_rate} bpm</strong></p>
              <p className="text-xs text-muted-foreground">Provider: {wearable.provider} (demo)</p>
              <Button type="button" variant="outline" className="rounded-xl w-full" onClick={handleWearableDisconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">Connect Apple Health, Google Fit, or Fitbit (demo sync).</p>
              <Button type="button" className="rounded-xl w-full" onClick={handleWearableConnect}>
                <Activity className="h-4 w-4 mr-2" />
                Connect wearable
              </Button>
            </>
          )}
        </PremiumCard>

        <PremiumCard icon={ShoppingBag} title="Grocery partnerships" loading={loading}>
          <p className="text-sm text-muted-foreground mb-3">Shop your weekly plan ingredients via partner apps.</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {["blinkit", "zepto", "bigbasket", "dmart"].map((id) => (
              <Button key={id} type="button" variant="outline" size="sm" className="rounded-xl capitalize" onClick={() => handleGrocery(id)}>
                {id}
              </Button>
            ))}
          </div>
          {grocery ? (
            <div className="text-sm border-t pt-3">
              <p className="font-medium">{grocery.items?.length} items · ~₹{grocery.estimatedCostInr}</p>
              <a href={grocery.partnerUrl} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline">
                Open {grocery.partner} →
              </a>
              <ul className="mt-2 text-xs text-muted-foreground max-h-24 overflow-y-auto">
                {grocery.items?.map((item) => (
                  <li key={item.name}>• {item.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </PremiumCard>
      </div>
    </AppShell>
  );
}

function PremiumCard({ icon: Icon, title, children, loading }) {
  return (
    <Card className="glass-card rounded-3xl p-6 border-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : children}
    </Card>
  );
}
