import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Salad,
  Dumbbell,
  HeartPulse,
  Footprints,
  BarChart3,
  Brain,
  Camera,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const FEATURES = [
  {
    icon: <Brain className="h-5 w-5" />,
    tint: "bg-violet-500/15 text-violet-500",
    title: "AI meal & workout plans",
    text: "Personalised diet and training built from your goals, schedule, equipment and preferences.",
  },
  {
    icon: <Flame className="h-5 w-5" />,
    tint: "bg-orange-500/15 text-orange-500",
    title: "Calorie counter",
    text: "Log meals in seconds. Live daily totals with protein, carbs and fats against your targets.",
  },
  {
    icon: <Salad className="h-5 w-5" />,
    tint: "bg-emerald-500/15 text-emerald-500",
    title: "Macro insights",
    text: "See what you're eating, not just how much — balance macros for muscle, cut or maintenance.",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    tint: "bg-rose-500/15 text-rose-500",
    title: "Cardio coaching",
    text: "Zone-2, HIIT or steady-state — prescribed from your recovery and weekly training load.",
  },
  {
    icon: <Dumbbell className="h-5 w-5" />,
    tint: "bg-indigo-500/15 text-indigo-500",
    title: "Strength programs",
    text: "Progressive overload, deload weeks and RPE-based loads so you keep gaining, not grinding.",
  },
  {
    icon: <Footprints className="h-5 w-5" />,
    tint: "bg-sky-500/15 text-sky-500",
    title: "Step goals",
    text: "Adaptive daily targets that flex on lift days vs rest days — every step counts.",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    tint: "bg-amber-500/15 text-amber-500",
    title: "Quick food logging",
    text: "Search, scan or describe a meal — FitnovaAI estimates nutrition without the spreadsheet pain.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    tint: "bg-teal-500/15 text-teal-500",
    title: "Progress analytics",
    text: "Weight trends, weekly reviews and charts that show the story behind the scale.",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    tint: "bg-pink-500/15 text-pink-500",
    title: "Smart reminders",
    text: "Gentle nudges for meals, water and movement — quiet hours when you need focus.",
  },
];

export default function Features() {
  useEffect(() => {
    document.title = "Features — FitnovaAI";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "AI meal plans, calorie tracking, macro insights, cardio plans, and progress analytics — all in one beautiful app.",
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="px-4 md:px-8 py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Everything in one app
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Features that keep you moving 🚀
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            AI meal plans, calorie tracking, macro insights, cardio plans, and progress
            analytics — designed to feel as good as the workout itself.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-3xl overflow-hidden shadow-xl"
        >
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?auto=format&fit=crop&w=1200&q=80"
            alt="Fitness tracking"
            className="w-full h-72 md:h-80 object-cover"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-3xl p-6 hover:-translate-y-0.5 transition-transform"
            >
              <span className={`h-10 w-10 rounded-2xl grid place-items-center ${f.tint}`}>
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 glass-card rounded-3xl p-8 md:p-10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ready to try it? 💪
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Start free — your first AI plan, calorie log and progress chart are minutes away.
          </p>
          <motion.div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full gap-2">
              <Link to="/signup">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <Link to="/about">Our story</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
