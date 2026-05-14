import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationHero } from "@/components/notifications/NotificationHero";
import { NotificationPreferenceRow } from "@/components/notifications/NotificationPreferenceRow";
import { PrivacyDataExportCard } from "@/components/privacy/PrivacyDataExportCard";
import { PrivacyDeleteAccountCard } from "@/components/privacy/PrivacyDeleteAccountCard";
import { ChevronLeft, Lock, Shield, Eye, Share2, Database } from "lucide-react";

const DEFAULT_PREFS = [
  { key: "profile", title: "Public profile", desc: "Allow friends to find you by name", icon: Eye, on: false },
  { key: "share", title: "Share workout activity", desc: "Visible to your connections", icon: Share2, on: true },
  { key: "analytics", title: "Anonymous analytics", desc: "Help us improve FitNova AI", icon: Database, on: true },
  { key: "ai", title: "AI personalization", desc: "Use my data to tailor coaching", icon: Shield, on: true },
];

function PrivacyPage() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const toggle = useCallback((key) => {
    setPrefs((prev) => prev.map((x) => (x.key === key ? { ...x, on: !x.on } : x)));
  }, []);

  const handleDownload = useCallback(() => {}, []);

  const handleDeleteAccount = useCallback(() => {}, []);

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
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Privacy</h1>
      </header>

      <NotificationHero
        icon={Lock}
        title="Your data, your rules"
        subtitle="Everything is encrypted at rest and in transit."
      />

      <Card className="glass-card rounded-3xl border-0 p-2 mb-5">
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

      <PrivacyDataExportCard onDownload={handleDownload} />
      <PrivacyDeleteAccountCard onDelete={handleDeleteAccount} />
    </AppShell>
  );
}

export default PrivacyPage;
