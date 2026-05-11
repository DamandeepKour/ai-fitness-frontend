import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock3, Flame, History } from "lucide-react";
import { getMealHistoryLast7Days, formatHistoryDayTitle } from "@/data/mealHistory7d";

function MealHistoryPage() {
  const days = getMealHistoryLast7Days();

  return (
    <AppShell>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-2 rounded-xl text-muted-foreground" asChild>
            <Link to="/profile" className="inline-flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Profile
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" />
            Last 7 days
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-1">Meal history</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            All entries from the past seven days, grouped by day.
          </p>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 -mr-1"
      >
        <div className="space-y-6 pb-8">
          {days.map((day) => (
            <Card key={day.date.toISOString()} className="glass-card rounded-3xl border-0 overflow-hidden">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 px-5 py-4 bg-accent/30">
                <div>
                  <h2 className="text-lg font-semibold">{formatHistoryDayTitle(day.date)}</h2>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(day.date)}
                  </p>
                </div>
                <p className="text-sm font-medium tabular-nums inline-flex items-center gap-1.5 text-primary">
                  <Flame className="h-4 w-4" />
                  {day.totalKcal} kcal
                </p>
              </div>
              <ul className="divide-y divide-border/60">
                {day.meals.map((m) => (
                  <li key={`${m.tag}-${m.time}-${m.name}`} className="px-5 py-4 flex gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary">{m.tag}</p>
                      <p className="font-medium leading-snug mt-0.5">{m.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5 shrink-0" />
                        {m.time}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums shrink-0 pt-5">{m.kcal} kcal</p>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}

export default MealHistoryPage;
