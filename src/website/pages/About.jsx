import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Flame,
  Dumbbell,
  Footprints,
  Salad,
  CalendarDays,
  CalendarRange,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  useEffect(() => {
    document.title = "About — FitnovaAI";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "How FitnovaAI builds personal cardio, strength and diet plans, tracks every calorie and step, and tells you why your weight loss has stalled.",
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our story</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
          Built by athletes, powered by AI 🤖💪
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          FitnovaAI started in a tiny gym corner with one wild question — what if
          tracking your fitness felt as good as the workout itself? We blend
          sports science, behavioural design and AI to make healthy living
          actually stick.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-10 rounded-3xl overflow-hidden shadow-xl"
        >
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
            alt="Team training"
            className="w-full h-80 object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 grid md:grid-cols-3 gap-5"
        >
          {[
            { emoji: "🌍", title: "Mission", text: "Make healthy living accessible, joyful and lasting for everyone." },
            { emoji: "❤️", title: "Values", text: "Empathy first. Science always. Design that respects you." },
            { emoji: "✨", title: "Promise", text: "No shame. No fads. Just real progress, your way." },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-3xl p-6"
            >
              <p className="text-3xl">{b.emoji}</p>
              <h3 className="mt-3 text-lg font-bold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Your plan, your pace
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            Cardio + a personal diet that fits your day 🥗🏃‍♀️
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            FitnovaAI builds a daily diet around your goal, body and schedule —
            then pairs it with the right cardio dose so progress actually shows up.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-6 overflow-hidden relative"
            >
              <motion.div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-2xl bg-rose-500/15 text-rose-500 grid place-items-center">
                  <Heart className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold">Cardio, tuned to you</h3>
              </motion.div>
              <p className="mt-2 text-sm text-muted-foreground">
                Zone-2 walks, HIIT bursts or steady-state runs — picked from your
                resting HR, recovery and weekly load.
              </p>
              <img
                src="https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=900&q=80"
                alt="Cardio run"
                className="mt-5 h-44 w-full object-cover rounded-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="glass-card rounded-3xl p-6 overflow-hidden relative"
            >
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-2xl bg-emerald-500/15 text-emerald-500 grid place-items-center">
                  <Salad className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold">Diet to your needs</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Veg, high-protein, low-carb or balanced — meals adapt to allergies,
                budget and what&apos;s actually in your kitchen.
              </p>
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"
                alt="Healthy plate"
                className="mt-5 h-44 w-full object-cover rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-5"
        >
          {[
            {
              icon: <CalendarDays className="h-5 w-5" />,
              tint: "bg-amber-500/15 text-amber-500",
              title: "Daily targets",
              text: "Calories, protein, carbs, fats, water and steps — refreshed every morning.",
              stat: "1,840 kcal · 142g P",
            },
            {
              icon: <CalendarRange className="h-5 w-5" />,
              tint: "bg-sky-500/15 text-sky-500",
              title: "Weekly review",
              text: "We average the noise out so one off-day doesn't ruin your week.",
              stat: "−0.4 kg / week",
            },
            {
              icon: <Flame className="h-5 w-5" />,
              tint: "bg-orange-500/15 text-orange-500",
              title: "Every calorie counts",
              text: "Scan, search or snap a photo — FitnovaAI logs it in seconds.",
              stat: "12,430 kcal tracked",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-3xl p-6"
            >
              <span className={`h-10 w-10 rounded-2xl grid place-items-center ${c.tint}`}>
                {c.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
              <p className="mt-4 text-sm font-semibold text-foreground">{c.stat}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Your weekly plan
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            One plan. Cardio, strength, steps — handled. 🏋️‍♂️👟
          </h2>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Heart className="h-5 w-5" />,
                tint: "bg-rose-500/15 text-rose-500",
                title: "Cardio",
                text: "3× zone-2 + 1× intervals tailored to your HR.",
              },
              {
                icon: <Dumbbell className="h-5 w-5" />,
                tint: "bg-violet-500/15 text-violet-500",
                title: "Strength",
                text: "Full-body splits with progressive overload built in.",
              },
              {
                icon: <Activity className="h-5 w-5" />,
                tint: "bg-emerald-500/15 text-emerald-500",
                title: "Weight training",
                text: "Compound lifts, smart deloads, RPE-based load picks.",
              },
              {
                icon: <Footprints className="h-5 w-5" />,
                tint: "bg-sky-500/15 text-sky-500",
                title: "Daily steps",
                text: "Adaptive goal — 8k on lift days, 12k on rest days.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-3xl p-6"
              >
                <span className={`h-10 w-10 rounded-2xl grid place-items-center ${c.tint}`}>
                  {c.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 glass-card rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <motion.div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-2xl bg-sky-500/15 text-sky-500 grid place-items-center">
                  <Footprints className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s steps</p>
                  <p className="text-2xl font-bold">7,842 / 10,000</p>
                </div>
              </motion.div>
              <p className="text-sm text-muted-foreground">2,158 to go ✨</p>
            </div>
            <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "78%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400"
              />
            </div>
            <div className="mt-6 grid grid-cols-7 gap-2">
              {[60, 80, 45, 90, 70, 100, 78].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${v}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="h-20 flex items-end"
                >
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-primary/40 to-primary"
                    style={{ height: `${v}%` }}
                  />
                </motion.div>
              ))}
            </div>
            <motion.div className="mt-2 grid grid-cols-7 gap-2 text-[10px] text-muted-foreground text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Honest feedback
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
            Not losing weight? We&apos;ll tell you why. 🔍
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            When the scale stalls, FitnovaAI looks at the last 14 days of food,
            sleep, steps and training — and points to the real reason.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Hidden calories",
                text: "Cooking oils, drinks and snacks are pushing you ~280 kcal over.",
              },
              {
                title: "Low protein",
                text: "You're averaging 0.9g/kg — bump to 1.6g/kg to protect muscle.",
              },
              {
                title: "Step drop",
                text: "Daily steps fell 38% this week. Add two 15-min walks.",
              },
              {
                title: "Poor sleep",
                text: "Avg 5h 40m — hunger hormones spike, cravings rise.",
              },
              {
                title: "Plateau, not a problem",
                text: "Your body adapted. Time for a refeed day and a deload week.",
              },
              {
                title: "Inconsistent logging",
                text: "Only 4/7 days tracked — weekend gaps hide the real picture.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-3xl p-6 flex gap-4"
              >
                <span className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500/15 text-amber-500 grid place-items-center">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 glass-card rounded-3xl p-6 md:p-8 flex items-start gap-4">
            <span className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-500/15 text-emerald-500 grid place-items-center">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold">This week&apos;s fix</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Drop calories by 150, add 2,000 steps/day, hit 130g protein, and
                sleep 7h+. FitnovaAI will re-check on Sunday and adjust again. 💪
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
