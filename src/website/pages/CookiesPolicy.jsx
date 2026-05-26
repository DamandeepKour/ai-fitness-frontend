// src/pages/CookiesPolicy.jsx

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cookie,
  ShieldCheck,
  BarChart3,
  Settings2,
  Lock,
  Mail,
} from "lucide-react";

const COOKIE_SECTIONS = [
  {
    icon: Cookie,
    title: "What Are Cookies?",
    description:
      "Cookies are small text files stored on your device that help improve your browsing experience, remember preferences, and provide personalized functionality across the FitNova AI platform.",
  },
  {
    icon: BarChart3,
    title: "How We Use Cookies",
    description:
      "FitNova AI uses cookies to analyze traffic, improve performance, maintain secure sessions, remember user settings, and personalize your AI-powered fitness experience.",
  },
  {
    icon: Lock,
    title: "Security & Privacy",
    description:
      "We never sell your personal information. Cookies used by FitNova AI are designed to improve functionality while keeping your account and health-related data protected.",
  },
  {
    icon: Settings2,
    title: "Managing Cookies",
    description:
      "You can disable or remove cookies anytime through your browser settings. Some platform features may not function properly if cookies are disabled.",
  },
  {
    icon: ShieldCheck,
    title: "Analytics & Performance",
    description:
      "We may use analytics and performance cookies to understand user behavior, monitor platform stability, and improve overall user experience on FitNova AI.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    description:
      "For any questions related to cookies, tracking technologies, or data privacy, feel free to contact our support team.",
    extra: "support@fitnovaai.com",
  },
];

export default function CookiesPolicy() {
  useEffect(() => {
    document.title = "Cookies Policy — FitNova AI";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute(
        "content",
        "Learn how FitNova AI uses cookies and tracking technologies to improve user experience, performance, and security."
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen px-4 md:px-8 py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            <Cookie className="h-4 w-4" />
            Cookies & Tracking
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Cookies Policy
          </h1>

          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto leading-7">
            This Cookies Policy explains how FitNova AI uses cookies and
            similar technologies to improve user experience, analyze platform
            performance, and maintain security across our services.
          </p>
        </div>

        {/* Cookie Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {COOKIE_SECTIONS.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card rounded-3xl p-6 md:p-8 border border-border/50"
              >
                <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h2 className="text-2xl font-semibold mb-4">
                  {section.title}
                </h2>

                <p className="text-muted-foreground leading-7">
                  {section.description}
                </p>

                {section.extra && (
                  <div className="mt-5 text-primary font-semibold">
                    {section.extra}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent border border-border">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Your privacy and security matter at FitNova AI
            </span>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            © 2026 FitNova AI. All rights reserved.
          </p>
        </div>
      </div>
    </motion.div>
  );
}