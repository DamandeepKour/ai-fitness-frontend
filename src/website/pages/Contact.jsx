import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const CONTACT_ITEMS = [
  { icon: Mail, label: "Email", value: "hello@fitnova.ai" },
  { icon: Phone, label: "Phone", value: "+1 (415) 555-0119" },
  { icon: MapPin, label: "HQ", value: "San Francisco, CA" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contact — FitnovaAI";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Reach the FitnovaAI team — we'd love to hear from you.",
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
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">
            Say hi 👋 we love a good DM
          </h1>
          <p className="mt-3 text-muted-foreground">
            Questions, feedback or partnership ideas — drop us a line and we&apos;ll
            get back within 24 hours.
          </p>

          <div className="mt-8 space-y-4">
            {CONTACT_ITEMS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="flex items-center gap-3">
                  <motion.div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="text-sm font-semibold">{c.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="glass-card rounded-3xl p-6 md:p-8 space-y-4"
        >
          <div>
            <label htmlFor="contact-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
              placeholder="Jordan Athlete"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm"
              placeholder="Tell us anything..."
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold shadow-lg hover:opacity-90 transition"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Send className="h-4 w-4" /> {sent ? "Sent! 🎉" : "Send message"}
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
