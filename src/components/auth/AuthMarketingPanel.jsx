import { motion, AnimatePresence } from "framer-motion";

/**
 * Right column: sharp rotating image + copy (large screens).
 * @param {{ slides: import("@/data/auth-visual-slides").AuthSlide[]; activeIndex: number }} props
 */
export function AuthMarketingPanel({ slides, activeIndex }) {
  const slide = slides[activeIndex % slides.length] ?? slides[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="hidden lg:block relative min-h-[560px] overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/50 via-transparent to-cyan-900/35 mix-blend-multiply dark:from-violet-950/60 dark:to-cyan-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-amber-900/10" />

      <div className="absolute bottom-8 left-8 right-8 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.headline}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-3xl font-semibold leading-tight drop-shadow-md">{slide.headline}</h3>
            <p className="mt-3 text-sm text-white/90 max-w-md leading-relaxed">{slide.sub}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-2">
          {slides.map((s, i) => (
            <span
              key={s.src}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex % slides.length ? "w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]" : "w-1.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
