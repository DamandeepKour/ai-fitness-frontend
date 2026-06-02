import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
import {
  Apple,
  Beef,
  Calendar,
  Flame,
  SkipForward,
  Target,
  Utensils,
} from "lucide-react";

const mealTypes = [
  { label: "Breakfast", count: 8420 },
  { label: "Lunch", count: 9650 },
  { label: "Dinner", count: 9120 },
  { label: "Snacks", count: 5340 },
  { label: "Pre-workout", count: 2110 },
];
const mealTotal = mealTypes.reduce((a, r) => a + r.count, 0);

const skippedMeals = [
  { label: "Breakfast", count: 1820 },
  { label: "Lunch", count: 410 },
  { label: "Dinner", count: 690 },
  { label: "Snacks", count: 2230 },
];
const skipTotal = skippedMeals.reduce((a, r) => a + r.count, 0);

const topFoods = [
  { name: "Grilled Chicken", logs: 4210, kcal: 165 },
  { name: "Oats with Banana", logs: 3870, kcal: 320 },
  { name: "Paneer Bhurji", logs: 2940, kcal: 280 },
  { name: "Greek Yogurt", logs: 2510, kcal: 130 },
  { name: "Brown Rice + Dal", logs: 2380, kcal: 410 },
  { name: "Avocado Toast", logs: 1990, kcal: 290 },
];

const weeklyAdherence = [
  { day: "Mon", score: 78 },
  { day: "Tue", score: 82 },
  { day: "Wed", score: 74 },
  { day: "Thu", score: 69 },
  { day: "Fri", score: 58 },
  { day: "Sat", score: 47 },
  { day: "Sun", score: 51 },
];

export default function SuperAdminNutritionPage() {
  const avgAdherence = Math.round(
    weeklyAdherence.reduce((a, d) => a + d.score, 0) / weeklyAdherence.length,
  );
  const avgKcal = 1840;
  const targetKcal = 2000;
  const diff = avgKcal - targetKcal;

  return (
    <AdminShell>
      <PageHeader
        title="Nutrition Analytics"
        subtitle="What users eat, what they skip, and how closely they hit targets."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Utensils} label="Meals logged (7d)" value={mealTotal} trend="+8.2% WoW" tone="primary" />
        <StatCard icon={SkipForward} label="Skipped meals (7d)" value={skipTotal} trend={`${Math.round((skipTotal / mealTotal) * 100)}% of logs`} tone="warning" />
        <StatCard
          icon={Flame}
          label="Avg kcal vs target"
          value={`${avgKcal}/${targetKcal}`}
          trend={diff >= 0 ? `+${diff} kcal over` : `${diff} kcal under`}
          tone={Math.abs(diff) > 200 ? "destructive" : "success"}
        />
        <StatCard icon={Target} label="Weekly adherence" value={avgAdherence} suffix="%" trend="rolling 7-day avg" tone="accent" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BreakdownCard
          title="Most selected meal types"
          icon={Apple}
          rows={mealTypes.map((r) => ({ ...r, total: mealTotal }))}
        />
        <BreakdownCard
          title="Most skipped meals"
          icon={SkipForward}
          rows={skippedMeals.map((r) => ({ ...r, total: skipTotal }))}
        />
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <Calendar className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">Weekly adherence score</h3>
          </div>
          <div className="mt-6 flex items-end gap-2 h-40">
            {weeklyAdherence.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted rounded-md overflow-hidden flex items-end h-32">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-success transition-all"
                    style={{ height: `${d.score}%` }}
                    title={`${d.score}%`}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
                <span className="text-xs font-semibold tabular-nums">{d.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Beef className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Top foods logged</h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Food</th>
                <th className="px-4 py-3 font-medium">Logs</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Kcal / serving</th>
                <th className="px-4 py-3 font-medium">Popularity</th>
              </tr>
            </thead>
            <tbody>
              {topFoods.map((f) => {
                const max = topFoods[0].logs;
                const w = Math.round((f.logs / max) * 100);
                return (
                  <tr key={f.name} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{f.name}</td>
                    <td className="px-4 py-3 tabular-nums">{f.logs.toLocaleString()}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground hidden sm:table-cell">{f.kcal}</td>
                    <td className="px-4 py-3">
                      <div className="h-2 w-40 max-w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${w}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}
// import AdminShell from "@/components/admin/AdminShell";
// import { Card } from "@/components/ui/card";
// import { StatCard, BreakdownCard, PageHeader } from "@/components/admin/shared";
// import {
//   Apple,
//   Beef,
//   Calendar,
//   Flame,
//   SkipForward,
//   Target,
//   Utensils,
// } from "lucide-react";

// const mealTypes = [
//   { label: "Breakfast", count: 8420 },
//   { label: "Lunch", count: 9650 },
//   { label: "Dinner", count: 9120 },
//   { label: "Snacks", count: 5340 },
//   { label: "Pre-workout", count: 2110 },
// ];
// const mealTotal = mealTypes.reduce((a, r) => a + r.count, 0);

// const skippedMeals = [
//   { label: "Breakfast", count: 1820 },
//   { label: "Lunch", count: 410 },
//   { label: "Dinner", count: 690 },
//   { label: "Snacks", count: 2230 },
// ];
// const skipTotal = skippedMeals.reduce((a, r) => a + r.count, 0);

// const topFoods = [
//   { name: "Grilled Chicken", logs: 4210, kcal: 165 },
//   { name: "Oats with Banana", logs: 3870, kcal: 320 },
//   { name: "Paneer Bhurji", logs: 2940, kcal: 280 },
//   { name: "Greek Yogurt", logs: 2510, kcal: 130 },
//   { name: "Brown Rice + Dal", logs: 2380, kcal: 410 },
//   { name: "Avocado Toast", logs: 1990, kcal: 290 },
// ];

// const weeklyAdherence = [
//   { day: "Mon", score: 78 },
//   { day: "Tue", score: 82 },
//   { day: "Wed", score: 74 },
//   { day: "Thu", score: 69 },
//   { day: "Fri", score: 58 },
//   { day: "Sat", score: 47 },
//   { day: "Sun", score: 51 },
// ];

// export default function SuperAdminNutritionPage() {
//   const avgAdherence = Math.round(
//     weeklyAdherence.reduce((a, d) => a + d.score, 0) / weeklyAdherence.length,
//   );
//   const avgKcal = 1840;
//   const targetKcal = 2000;
//   const diff = avgKcal - targetKcal;

//   return (
//     <AdminShell>
//       <PageHeader
//         title="Nutrition Analytics"
//         subtitle="What users eat, what they skip, and how closely they hit targets."
//       />

//       <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <StatCard icon={Utensils} label="Meals logged (7d)" value={mealTotal} trend="+8.2% WoW" tone="primary" />
//         <StatCard icon={SkipForward} label="Skipped meals (7d)" value={skipTotal} trend={`${Math.round((skipTotal / mealTotal) * 100)}% of logs`} tone="warning" />
//         <StatCard
//           icon={Flame}
//           label="Avg kcal vs target"
//           value={`${avgKcal}/${targetKcal}`}
//           trend={diff >= 0 ? `+${diff} kcal over` : `${diff} kcal under`}
//           tone={Math.abs(diff) > 200 ? "destructive" : "success"}
//         />
//         <StatCard icon={Target} label="Weekly adherence" value={avgAdherence} suffix="%" trend="rolling 7-day avg" tone="accent" />
//       </section>

//       <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <BreakdownCard
//           title="Most selected meal types"
//           icon={Apple}
//           rows={mealTypes.map((r) => ({ ...r, total: mealTotal }))}
//         />
//         <BreakdownCard
//           title="Most skipped meals"
//           icon={SkipForward}
//           rows={skippedMeals.map((r) => ({ ...r, total: skipTotal }))}
//         />
//         <Card className="p-6">
//           <div className="flex items-center gap-2">
//             <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
//               <Calendar className="h-4 w-4" />
//             </div>
//             <h3 className="font-semibold">Weekly adherence score</h3>
//           </div>
//           <div className="mt-6 flex items-end gap-2 h-40">
//             {weeklyAdherence.map((d) => (
//               <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
//                 <div className="w-full bg-muted rounded-md overflow-hidden flex items-end h-32">
//                   <div
//                     className="w-full bg-gradient-to-t from-primary to-success transition-all"
//                     style={{ height: `${d.score}%` }}
//                     title={`${d.score}%`}
//                   />
//                 </div>
//                 <span className="text-[11px] text-muted-foreground">{d.day}</span>
//                 <span className="text-xs font-semibold tabular-nums">{d.score}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </section>

//       <Card className="p-6">
//         <div className="flex items-center gap-2 mb-5">
//           <Beef className="h-5 w-5 text-primary" />
//           <h2 className="text-base font-semibold">Top foods logged</h2>
//         </div>
//         <div className="overflow-hidden rounded-xl border border-border">
//           <table className="w-full text-sm">
//             <thead className="bg-muted/50 text-muted-foreground">
//               <tr className="text-left">
//                 <th className="px-4 py-3 font-medium">Food</th>
//                 <th className="px-4 py-3 font-medium">Logs</th>
//                 <th className="px-4 py-3 font-medium hidden sm:table-cell">Kcal / serving</th>
//                 <th className="px-4 py-3 font-medium">Popularity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topFoods.map((f) => {
//                 const max = topFoods[0].logs;
//                 const w = Math.round((f.logs / max) * 100);
//                 return (
//                   <tr key={f.name} className="border-t border-border">
//                     <td className="px-4 py-3 font-medium">{f.name}</td>
//                     <td className="px-4 py-3 tabular-nums">{f.logs.toLocaleString()}</td>
//                     <td className="px-4 py-3 tabular-nums text-muted-foreground hidden sm:table-cell">{f.kcal}</td>
//                     <td className="px-4 py-3">
//                       <div className="h-2 w-40 max-w-full rounded-full bg-muted overflow-hidden">
//                         <div className="h-full bg-primary rounded-full" style={{ width: `${w}%` }} />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </AdminShell>
//   );
// }
