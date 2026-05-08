import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

const weight = [
  { d: "W1", v: 74.0 },
  { d: "W2", v: 73.6 },
  { d: "W3", v: 73.2 },
  { d: "W4", v: 73.0 },
  { d: "W5", v: 72.7 },
  { d: "W6", v: 72.6 },
  { d: "W7", v: 72.5 },
  { d: "W8", v: 72.4 },
];

const workouts = [
  { d: "Mon", v: 35 },
  { d: "Tue", v: 0 },
  { d: "Wed", v: 50 },
  { d: "Thu", v: 28 },
  { d: "Fri", v: 42 },
  { d: "Sat", v: 60 },
  { d: "Sun", v: 20 },
];

function ProgressPage() {
  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Last 8 weeks</p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-1">Your Progress</h1>
      </header>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <KPI label="Weight Δ" value="-1.6 kg" tint="oklch(0.7 0.17 145)" />
        <KPI label="Avg kcal" value="1,910" tint="oklch(0.62 0.19 255)" />
        <KPI label="Workouts" value="22 sessions" tint="oklch(0.78 0.16 75)" />
      </div>

      <Card className="glass-card rounded-3xl p-6 border-0 mb-5">
        <h2 className="text-lg font-semibold mb-1">Weight trend</h2>
        <p className="text-xs text-muted-foreground mb-4">kg over time</p>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={weight} margin={{ left: -20, right: 10, top: 10 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="v" stroke="oklch(0.62 0.19 255)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.62 0.19 255)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="glass-card rounded-3xl p-6 border-0">
        <h2 className="text-lg font-semibold mb-1">Workout minutes</h2>
        <p className="text-xs text-muted-foreground mb-4">This week</p>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={workouts} margin={{ left: -20, right: 10 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="v" fill="oklch(0.7 0.17 145)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </AppShell>
  );
}

function KPI({ label, value, tint }) {
  return (
    <Card className="glass-card rounded-3xl p-5 border-0">
      <p className="text-xs" style={{ color: tint }}>
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
    </Card>
  );
}

export default ProgressPage;
