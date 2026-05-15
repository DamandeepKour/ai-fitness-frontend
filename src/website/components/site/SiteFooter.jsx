import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Heart, Share2, Globe, Video } from "lucide-react";

const socialIcons = [Share2, Globe, Video];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Activity className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg font-bold">FitnovaAI</p>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Your AI-powered fitness companion. Track meals 🥗, crush cardio 🏃, build strength 💪,
              and hit your macros — all in one place.
            </p>
            <div className="flex gap-2 mt-4">
              {socialIcons.map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-foreground hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-foreground">
                  Open App
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FitnovaAI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for movers & makers
          </p>
        </div>
      </div>
    </footer>
  );
}
