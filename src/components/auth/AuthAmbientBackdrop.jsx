import { motion, AnimatePresence } from "framer-motion";

const FADE_MS = 1.1;

/**
 * Full-viewport soft rotating imagery + rich gradient mesh (sits behind auth card).
 * @param {{ sources: string[]; activeIndex: number }} props
 */
export function AuthAmbientBackdrop({ sources, activeIndex }) {
  if (!sources.length) return null;
  const src = sources[activeIndex % sources.length];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <AnimatePresence mode="sync">
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_MS, ease: "easeOut" }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover blur-2xl scale-[1.12] opacity-[0.28] dark:opacity-[0.2]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/28 via-violet-500/22 to-rose-400/28 dark:from-cyan-500/18 dark:via-violet-600/22 dark:to-fuchsia-600/18" />
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[70%] w-[70%] rounded-full bg-gradient-to-br from-amber-300/40 to-orange-500/28 blur-3xl dark:from-amber-500/22 dark:to-orange-600/14"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[65%] w-[65%] rounded-full bg-gradient-to-tl from-sky-400/35 to-emerald-400/28 blur-3xl dark:from-sky-500/20 dark:to-emerald-500/14"
        animate={{ x: [0, -35, 0], y: [0, -25, 0], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[45%] w-[50%] -translate-x-1/2 rounded-full bg-fuchsia-400/25 blur-3xl dark:bg-fuchsia-500/14"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/60 to-background/88 dark:from-background/92 dark:via-background/82 dark:to-background/96" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-5%,rgba(56,189,248,0.22),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(129,140,248,0.22),transparent_52%)]" />
    </div>
  );
}
