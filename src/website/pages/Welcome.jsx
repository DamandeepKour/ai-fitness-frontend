import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Apple,
  Flame,
  Footprints,
  HeartPulse,
  Salad,
  Dumbbell,
  Sparkles,
  ArrowRight,
  Star,
  Plus,
  Minus,
  Zap,
  Leaf,
  Drumstick,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function Counter({ to, suffix = "" }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString() + suffix);
  const [val, setVal] = useState("0" + suffix);

  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.8, ease: "easeOut" });
    const unsub = rounded.on("change", setVal);
    return () => {
      controls.stop();
      unsub();
    };
  }, [to, mv, rounded, suffix]);

  return <motion.span>{val}</motion.span>;
}

const FOODS = [
  {
    name: "Avocado Toast",
    kcal: 320,
    p: 12,
    c: 30,
    f: 18,
    emoji: "🥑",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Chicken Bowl",
    kcal: 540,
    p: 45,
    c: 50,
    f: 14,
    emoji: "🍗",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Berry Smoothie",
    kcal: 240,
    p: 8,
    c: 42,
    f: 4,
    emoji: "🍓",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Salmon Plate",
    kcal: 560,
    p: 42,
    c: 30,
    f: 26,
    emoji: "🐟",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Greek Salad",
    kcal: 280,
    p: 10,
    c: 18,
    f: 18,
    emoji: "🥗",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Oat Pancakes",
    kcal: 410,
    p: 14,
    c: 60,
    f: 11,
    emoji: "🥞",
    img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Welcome() {
  useEffect(() => {
    document.title = "FitnovaAI — Fitness, food & calorie counter";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Track meals, calories, macros, cardio and steps with FitnovaAI — a beautifully animated AI-powered fitness companion.",
      );
    }
  }, []);

  const [items, setItems] = useState([FOODS[0], FOODS[1]]);
  const total = items.reduce(
    (a, x) => ({ kcal: a.kcal + x.kcal, p: a.p + x.p, c: a.c + x.c, f: a.f + x.f }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );
  const goal = 2200;
  const pct = Math.min(100, Math.round((total.kcal / goal) * 100));

  return (
    <div className="overflow-hidden">
      <section className="aurora-bg px-4 md:px-8 pt-20 md:pt-28 pb-24">
        <div
          className="aurora-orb"
          style={{ width: 520, height: 520, top: -120, left: -120, background: "oklch(0.6 0.25 290)" }}
        />
        <div
          className="aurora-orb"
          style={{
            width: 480,
            height: 480,
            top: 40,
            right: -140,
            background: "oklch(0.65 0.22 200)",
            animationDelay: "-4s",
          }}
        />
        <div
          className="aurora-orb"
          style={{
            width: 460,
            height: 460,
            bottom: -160,
            left: "30%",
            background: "oklch(0.65 0.22 145)",
            animationDelay: "-8s",
          }}
        />

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              AI Coach 2.0 · Calorie counter live
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-white">
              Your fitness & <span className="text-shine">food universe</span>, in one app. 🚀
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-lg leading-relaxed">
              Count every calorie 🔥, balance macros ⚖️, plan healthy meals 🥗 and crush cardio 🏃 —
              beautifully animated, brutally accurate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold shadow-xl hover:scale-105 transition"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#nutrition"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition backdrop-blur-md"
              >
                Explore features
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { label: "Calories tracked", v: 12400000, s: "" },
                { label: "Active users", v: 42000, s: "+" },
                { label: "Meals logged", v: 3200000, s: "" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">
                    <Counter to={s.v} suffix={s.s} />
                  </p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-3xl p-6 md:p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">Today</p>
                  <p className="text-sm font-semibold">Calorie counter</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                  <Flame className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <p className="text-5xl md:text-6xl font-bold tabular-nums">
                  <Counter to={total.kcal} />
                </p>
                <p className="pb-2 text-white/60">/ {goal} kcal</p>
              </div>

              <div className="mt-3 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  {
                    l: "Protein",
                    v: total.p,
                    max: 150,
                    c: "from-rose-400 to-rose-600",
                    icon: <Drumstick className="h-3 w-3" />,
                  },
                  {
                    l: "Carbs",
                    v: total.c,
                    max: 250,
                    c: "from-amber-400 to-orange-500",
                    icon: <Zap className="h-3 w-3" />,
                  },
                  {
                    l: "Fats",
                    v: total.f,
                    max: 70,
                    c: "from-emerald-400 to-emerald-600",
                    icon: <Leaf className="h-3 w-3" />,
                  },
                ].map((m) => (
                  <div key={m.l} className="rounded-xl bg-white/5 p-3 border border-white/10">
                    <div className="flex items-center justify-center gap-1 text-white/70">
                      {m.icon}
                      {m.l}
                    </div>
                    <p className="mt-1 font-bold">{m.v}g</p>
                    <div className="mt-2 h-1 rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${m.c}`}
                        style={{ width: `${Math.min(100, (m.v / m.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 mb-2 text-xs uppercase tracking-wider text-white/50">Try adding meals</p>
              <div className="grid grid-cols-2 gap-2">
                {FOODS.slice(0, 4).map((f) => {
                  const inList = items.find((i) => i.name === f.name);
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() =>
                        setItems((prev) =>
                          inList ? prev.filter((p) => p.name !== f.name) : [...prev, f],
                        )
                      }
                      className={`group flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs transition ${
                        inList
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-base">{f.emoji}</span>
                      <span className="flex-1 font-semibold truncate">{f.name}</span>
                      {inList ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-3 -top-3 px-3 py-1.5 rounded-full bg-emerald-400 text-emerald-950 text-xs font-bold shadow-lg"
            >
              Live demo · tap to log
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-y border-border/60 bg-card/30 overflow-hidden">
        <div className="flex marquee-track gap-6 w-max">
          {[...FOODS, ...FOODS, ...FOODS].map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-sm shrink-0"
            >
              <img src={f.img} alt={f.name} className="h-10 w-10 rounded-xl object-cover" />
              <div className="text-sm">
                <p className="font-semibold">
                  {f.emoji} {f.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {f.kcal} kcal · P{f.p} C{f.c} F{f.f}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Flame, label: "Calories tracked", value: "12.4M", color: "text-rose-500", bg: "bg-rose-100" },
            { icon: Footprints, label: "Steps walked", value: "920M+", color: "text-sky-500", bg: "bg-sky-100" },
            { icon: HeartPulse, label: "Cardio sessions", value: "1.8M", color: "text-violet-500", bg: "bg-violet-100" },
            { icon: Salad, label: "Healthy meals", value: "3.2M", color: "text-emerald-500", bg: "bg-emerald-100" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="nutrition" className="px-4 md:px-8 mt-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Nutrition</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Meals that fuel real results 🥑
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore recipes tailored to your goals, with calories and macros computed instantly.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FOODS.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/95 text-[10px] font-bold">
                  {m.kcal} kcal
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-sm font-bold">
                    {m.emoji} {m.name}
                  </p>
                  <p className="text-[10px] opacity-80">
                    P{m.p} · C{m.c} · F{m.f}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 mt-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Cardio that doesn't burn out",
              copy: "Adaptive HIIT, zone-2 runs and recovery rides.",
              emoji: "🏃‍♀️",
              img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Walk your way to wins",
              copy: "Hit 10K steps with playful streaks and routes.",
              emoji: "🚶",
              img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Strength, simplified",
              copy: "Personalized lifting plans with rep tracking.",
              emoji: "🏋️",
              img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
            },
          ].map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-3xl overflow-hidden"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <p className="text-2xl">{c.emoji}</p>
                <h3 className="mt-2 text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.copy}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Loved worldwide</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              42,000+ athletes can&apos;t be wrong ⭐
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Maya R.",
                role: "Marathoner",
                quote: "The macro tracker is chef's kiss. Lost 8kg without obsessing.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Jordan K.",
                role: "CrossFit coach",
                quote: "My athletes stopped guessing. The calorie counter just works.",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Aisha P.",
                role: "Yoga teacher",
                quote: "Beautiful, calm, and surprisingly powerful. My new daily ritual.",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-6"
              >
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 mt-24 mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="aurora-bg max-w-7xl mx-auto rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div
            className="aurora-orb"
            style={{ width: 400, height: 400, top: -100, left: -100, background: "oklch(0.6 0.22 290)" }}
          />
          <div
            className="aurora-orb"
            style={{
              width: 400,
              height: 400,
              bottom: -100,
              right: -100,
              background: "oklch(0.65 0.22 200)",
              animationDelay: "-6s",
            }}
          />
          <div className="relative">
            <Dumbbell className="h-10 w-10 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Your healthiest year starts <span className="text-shine">today</span> 🚀
            </h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              Join thousands building a stronger, leaner, happier version of themselves with FitnovaAI.
            </p>
            <Link
              to="/signup"
              className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white text-black font-semibold shadow-xl hover:scale-105 transition-transform"
            >
              <Apple className="h-4 w-4" /> Open the app
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
