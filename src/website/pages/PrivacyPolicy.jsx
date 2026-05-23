// src/pages/PrivacyPolicy.jsx

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  Lock,
  Cookie,
  UserCheck,
  Mail,
} from "lucide-react";

const POLICY_SECTIONS = [
  {
    icon: Database,
    title: "Information We Collect",
    description:
      "We collect information like your name, email, age, height, weight, fitness goals, activity level, and nutrition preferences to generate personalized AI-powered diet and workout plans.",
  },
  {
    icon: ShieldCheck,
    title: "How We Use Your Data",
    description:
      "Your information is used to provide smart fitness recommendations, calorie tracking, progress analytics, AI feedback, and personalized wellness insights across the FitNova AI platform.",
  },
  {
    icon: Lock,
    title: "Data Security",
    description:
      "We use secure authentication, encrypted APIs, protected databases, JWT authorization, and role-based access controls to keep your personal and health-related data safe.",
  },
  {
    icon: Cookie,
    title: "Cookies & Analytics",
    description:
      "FitNova AI may use cookies and analytics tools to improve platform performance, personalize experiences, and understand usage trends for better product improvements.",
  },
  {
    icon: UserCheck,
    title: "User Rights",
    description:
      "Users can request access, modification, export, or deletion of their personal information anytime by contacting our support team.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    description:
      "For privacy-related questions or concerns, feel free to contact our support team anytime.",
    extra: "support@fitnovaai.com",
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — FitNova AI";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute(
        "content",
        "Read the FitNova AI privacy policy to understand how we collect, use, and protect your personal and health-related information."
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
            <ShieldCheck className="h-4 w-4" />
            Privacy & Security
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto leading-7">
            At FitNova AI, we value your privacy and are committed to protecting
            your personal and health-related information using modern security
            standards and responsible data practices.
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {POLICY_SECTIONS.map((section, index) => {
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
              Your privacy matters at FitNova AI
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