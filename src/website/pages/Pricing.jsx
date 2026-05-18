import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    emoji: "🌱",
    desc: "Everything to get moving today.",
    features: ["Calorie & macro tracker", "Daily step goals", "Basic meal library", "Community support"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    suffix: "/mo",
    emoji: "🔥",
    desc: "For people serious about results.",
    features: [
      "Everything in Starter",
      "AI Coach 2.0",
      "Custom macro plans",
      "Cardio & lifting programs",
      "Sleep & recovery insights",
    ],
    cta: "Start 7-day trial",
    highlight: true,
  },
  {
    name: "Elite",
    price: "$19",
    suffix: "/mo",
    emoji: "🏆",
    desc: "1:1 guidance and pro-level analytics.",
    features: ["Everything in Pro", "Live coach reviews", "Advanced biometrics", "Priority support"],
    cta: "Go Elite",
    highlight: false,
  },
];

export default function Pricing() {
  useEffect(() => {
    document.title = "Pricing — FitnovaAI";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Simple, transparent pricing. Start free, upgrade when you're ready.",
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
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
            Simple plans for every goal 💸
          </h1>
          <p className="mt-3 text-muted-foreground">
            Cancel anytime. No hidden fees. Just results.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-7 ${t.highlight ? "text-white shadow-2xl" : "glass-card"}`}
              style={t.highlight ? { background: "var(--gradient-hero)" } : undefined}
            >
              {t.highlight && (
                <span className="absolute -top-3 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white text-foreground shadow">
                  <Sparkles className="h-3 w-3" /> Most loved
                </span>
              )}
              <p className="text-3xl">{t.emoji}</p>
              <p className="mt-3 text-sm font-semibold opacity-90">{t.name}</p>
              <motion.div className="mt-1 flex items-end gap-1">
                <p className="text-4xl font-bold">{t.price}</p>
                {t.suffix && <p className="pb-1 text-sm opacity-80">{t.suffix}</p>}
              </motion.div>
              <p className={`mt-2 text-sm ${t.highlight ? "opacity-90" : "text-muted-foreground"}`}>
                {t.desc}
              </p>

              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${t.highlight ? "text-white" : "text-emerald-500"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`mt-7 inline-flex w-full items-center justify-center px-5 py-3 rounded-2xl font-semibold transition ${
                  t.highlight
                    ? "bg-white text-foreground hover:scale-[1.02]"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
