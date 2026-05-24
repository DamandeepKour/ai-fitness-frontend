import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContact } from "@/hooks/use-contact";

const CONTACT_ITEMS = [
  { icon: Mail, label: "Email", value: "hello@fitnova.ai" },
];

const EMPTY_FORM = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);

  const navigate = useNavigate();

  const { submit, loading, error, sent, reset } = useContact();

  useEffect(() => {
    document.title = "Contact — FitnovaAI";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute(
        "content",
        "Reach the FitnovaAI team — we'd love to hear from you."
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (sent) reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await submit(form);

    if (result.ok) {
      setForm(EMPTY_FORM);

      // ✅ Show success message briefly then redirect
      setTimeout(() => {
        navigate("/welcome");
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="px-4 md:px-8 py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Contact
          </p>

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
                  <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {c.label}
                    </p>

                    <p className="text-sm font-semibold">
                      {c.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl p-6 md:p-8 space-y-4"
        >
          {/* ✅ Success Message */}
          {sent && (
            <p className="rounded-xl bg-emerald-500/10 text-emerald-400 text-sm px-4 py-3 border border-emerald-500/20">
              Thanks for reaching out — we&apos;ll get back to you within 24 hours.
            </p>
          )}

          {/* Error */}
          {error && (
            <p
              className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              disabled={loading}
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm disabled:opacity-60"
              placeholder="Jordan Athlete"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm disabled:opacity-60"
              placeholder="you@email.com"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="text-sm font-medium"
            >
              Message
            </label>

            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              minLength={10}
              rows={5}
              disabled={loading}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm disabled:opacity-60"
              placeholder="Tell us anything..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-60"
            style={{ background: "var(--gradient-hero)" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : sent ? (
              <>
                <Send className="h-4 w-4" />
                Sent!
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}