import { useEffect, useState } from "react";
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
import { IMAGE_FALLBACK, SITE_IMAGES } from "@/data/site-images";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function SiteImage({ src, alt, className }) {
  const [url, setUrl] = useState(src);

  useEffect(() => {
    setUrl(src);
  }, [src]);

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (url !== IMAGE_FALLBACK) setUrl(IMAGE_FALLBACK);
      }}
    />
  );
}

const FEATURES = [
  {
    icon: <Brain className="h-5 w-5" />,
    tint: "bg-violet-500/15 text-violet-500",
    title: "AI meal & workout plans",
    text: "Personalised diet and training built from your goals, schedule, equipment and preferences.",
    image: SITE_IMAGES.athleteTraining,
    imageAlt: "Athlete training with determination",
  },
  {
    icon: <Flame className="h-5 w-5" />,
    tint: "bg-orange-500/15 text-orange-500",
    title: "Calorie counter",
    text: "Log meals in seconds. Live daily totals with protein, carbs and fats against your targets.",
    image: SITE_IMAGES.pokeBowl,
    imageAlt: "Colourful healthy bowl with tracked nutrition",
  },
  {
    icon: <Salad className="h-5 w-5" />,
    tint: "bg-emerald-500/15 text-emerald-500",
    title: "Macro insights",
    text: "See what you're eating, not just how much — balance macros for muscle, cut or maintenance.",
    image: SITE_IMAGES.saladSpread,
    imageAlt: "Balanced macro-focused meal spread",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    tint: "bg-rose-500/15 text-rose-500",
    title: "Cardio coaching",
    text: "Zone-2, HIIT or steady-state — prescribed from your recovery and weekly training load.",
    image: SITE_IMAGES.runnerCardio,
    imageAlt: "Runner training outdoors",
  },
  {
    icon: <Dumbbell className="h-5 w-5" />,
    tint: "bg-indigo-500/15 text-indigo-500",
    title: "Strength programs",
    text: "Progressive overload, deload weeks and RPE-based loads so you keep gaining, not grinding.",
    image: SITE_IMAGES.gymDumbbells,
    imageAlt: "Strength training in the gym",
  },
  {
    icon: <Footprints className="h-5 w-5" />,
    tint: "bg-sky-500/15 text-sky-500",
    title: "Step goals",
    text: "Adaptive daily targets that flex on lift days vs rest days — every step counts.",
    image: SITE_IMAGES.runningSunrise,
    imageAlt: "Running outdoors at sunrise",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    tint: "bg-amber-500/15 text-amber-500",
    title: "Quick food logging",
    text: "Search, scan or describe a meal — FitnovaAI estimates nutrition without the spreadsheet pain.",
    image: SITE_IMAGES.pizzaMeal,
    imageAlt: "Meal photo ready to log",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    tint: "bg-teal-500/15 text-teal-500",
    title: "Progress analytics",
    text: "Weight trends, weekly reviews and charts that show the story behind the scale.",
    image: SITE_IMAGES.gymStrength,
    imageAlt: "Fitness progress and training analytics",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    tint: "bg-pink-500/15 text-pink-500",
    title: "Smart reminders",
    text: "Gentle nudges for meals, water and movement — quiet hours when you need focus.",
    image: SITE_IMAGES.yogaBalance,
    imageAlt: "Mindful movement and recovery",
  },
];

const HIGHLIGHTS = [
  {
    title: "Fuel & track",
    text: "Meals, macros and calories in one beautiful flow.",
    image: SITE_IMAGES.greenSalad,
    imageAlt: "Fresh salad and healthy ingredients",
  },
  {
    title: "Train & recover",
    text: "Cardio, lifting and steps — synced to how you actually feel.",
    image: SITE_IMAGES.outdoorWorkout,
    imageAlt: "Outdoor workout and recovery",
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
          <SiteImage
            src={SITE_IMAGES.heroFeatures}
            alt="Athlete using fitness tracking app"
            className="w-full h-72 md:h-96 object-cover"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid md:grid-cols-2 gap-5"
        >
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden"
            >
              <SiteImage
                src={h.image}
                alt={h.imageAlt}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold">{h.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Full toolkit
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
            Every feature, visualised 📸
          </h2>
        </motion.div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-3xl overflow-hidden hover:-translate-y-0.5 transition-transform group"
            >
              <div className="relative overflow-hidden">
                <SiteImage
                  src={f.image}
                  alt={f.imageAlt}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute top-3 left-3 h-10 w-10 rounded-2xl grid place-items-center shadow-md backdrop-blur-sm ${f.tint}`}
                >
                  {f.icon}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">India-first roadmap</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">built in</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-lg">Smart layer</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Indian food swap engine (paneer → tofu, rice → millets)</li>
                <li>Pantry mode — meals from what&apos;s in your kitchen</li>
                <li>Budget plans — ₹150 to ₹400/day tiers</li>
                <li>Vernacular coaching in Hindi + English</li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-6">
              <h3 className="font-bold text-lg">Premium</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Live coach review of AI meal plans</li>
                <li>Family plans for up to 6 members</li>
                <li>WhatsApp meal reminders</li>
                <li>Lab-report recommendations, wearables, grocery partners</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 rounded-3xl overflow-hidden shadow-xl relative"
        >
          <SiteImage
            src={SITE_IMAGES.ctaGym}
            alt="Gym community training together"
            className="w-full h-56 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Ready to try it?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Start free — your first AI plan, calorie log and progress chart are minutes away.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full gap-2">
                <Link to="/signup">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="rounded-full">
                <Link to="/about">Our story</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
