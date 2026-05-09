import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-gradient-to-br from-sky-100/90 via-background to-orange-50/80 p-4 dark:from-slate-950 dark:via-background dark:to-slate-900">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/95 shadow-xl backdrop-blur-xl dark:bg-card/90 dark:shadow-black/40 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-8 md:p-12"
        >
          <p className="text-sm text-muted-foreground mb-2">Start your healthy journey</p>
          <h2 className="mb-2 text-4xl font-semibold text-foreground">Create account</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Build better food and fitness habits with motivating daily insights.
          </p>

          <div className="space-y-4">
            <input
              placeholder="Name"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login here
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="hidden lg:block relative min-h-[560px]"
        >
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80"
            alt="Workout and healthy lifestyle"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-3xl font-semibold leading-tight">Strong body, focused mind, better life.</h3>
            <p className="mt-3 text-sm text-white/90">
              Join Vital and turn everyday choices into long-term healthy results.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
