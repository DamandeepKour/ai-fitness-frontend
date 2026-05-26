// src/pages/TermsConditions.jsx

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Lock,
  Ban,
} from "lucide-react";

const TERMS_SECTIONS = [
  {
    icon: UserCheck,
    title: "User Responsibilities",
    description:
      "By using FitNova AI, you agree to provide accurate information and use the platform responsibly. You are responsible for maintaining the confidentiality of your account credentials.",
  },
  {
    icon: ShieldCheck,
    title: "Acceptable Usage",
    description:
      "Users must not misuse the platform, attempt unauthorized access, disrupt services, or use FitNova AI for illegal, harmful, or abusive activities.",
  },
  {
    icon: FileText,
    title: "AI Recommendations Disclaimer",
    description:
      "FitNova AI provides AI-generated fitness and nutrition suggestions intended for informational purposes only. The platform does not replace professional medical advice, diagnosis, or treatment.",
  },
  {
    icon: Lock,
    title: "Account & Security",
    description:
      "We use modern security practices to protect user data, but users are responsible for securing their own devices and login credentials while accessing the platform.",
  },
  {
    icon: Ban,
    title: "Termination of Access",
    description:
      "FitNova AI reserves the right to suspend or terminate accounts that violate these terms, misuse the platform, or engage in suspicious or harmful activities.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    description:
      "FitNova AI shall not be held responsible for any direct or indirect damages, injuries, or losses resulting from the use of AI-generated health, workout, or dietary recommendations.",
    extra: "Use the platform responsibly and consult professionals when needed.",
  },
];

export default function TermsConditions() {
  useEffect(() => {
    document.title = "Terms & Conditions — FitNova AI";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute(
        "content",
        "Read the FitNova AI Terms & Conditions to understand your rights, responsibilities, and platform usage guidelines."
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
            <FileText className="h-4 w-4" />
            Legal & Usage
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto leading-7">
            These Terms & Conditions govern your access and use of FitNova AI.
            By using the platform, you agree to comply with these terms and all
            applicable laws and regulations.
          </p>
        </div>

        {/* Terms Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {TERMS_SECTIONS.map((section, index) => {
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
              Please use FitNova AI responsibly
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