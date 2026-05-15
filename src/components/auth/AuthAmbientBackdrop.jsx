import { motion, AnimatePresence } from "framer-motion";

const FADE_S = 0.75;

/**
 * Full-viewport soft rotating imagery + gradient mesh (behind auth card).
 */
export function AuthAmbientBackdrop({ sources, activeIndex }) {
  if (!sources.length) return null;
  const src = sources[activeIndex % sources.length];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_S, ease: "easeInOut" }}
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
        animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[65%] w-[65%] rounded-full bg-gradient-to-tl from-sky-400/35 to-emerald-400/28 blur-3xl dark:from-sky-500/20 dark:to-emerald-500/14"
        animate={{ x: [0, -20, 0], y: [0, -16, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/60 to-background/88 dark:from-background/92 dark:via-background/82 dark:to-background/96" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-5%,rgba(56,189,248,0.22),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(129,140,248,0.22),transparent_52%)]" />
    </div>
  );
}
