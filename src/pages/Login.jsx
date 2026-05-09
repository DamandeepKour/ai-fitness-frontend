// src/pages/Login.jsx

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const setAuthCookie = (token) => {
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; samesite=lax`;
  };

  const handleLogin = async () => {
    try {
      setError("");
      const res = await API.post("/auth/login", form);
      const token = res.data?.data?.token;

      if (!token) {
        setError("Login failed: token not received.");
        return;
      }

      localStorage.setItem("token", token);
      setAuthCookie(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-gradient-to-br from-sky-100/90 via-background to-orange-50/80 p-4 dark:from-slate-950 dark:via-background dark:to-slate-900">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/95 shadow-xl backdrop-blur-xl dark:bg-card/90 dark:shadow-black/40 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="p-8 md:p-12"
        >
          <p className="text-sm text-muted-foreground mb-2">Welcome back to Vital</p>
          <h2 className="mb-2 text-4xl font-semibold text-foreground">Login to continue</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Track meals, workouts, hydration, and your healthy progress every day.
          </p>

          <div className="space-y-4">
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
            onClick={handleLogin}
            className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Login
          </button>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
          <p className="mt-4 text-sm text-muted-foreground">
            New user?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="hidden lg:block relative min-h-[560px]"
        >
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80"
            alt="Healthy food and active lifestyle"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-3xl font-semibold leading-tight">Eat smart. Train strong. Live positive.</h3>
            <p className="mt-3 text-sm text-white/90">
              Your daily dashboard keeps nutrition and exercise goals clear and motivating.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;