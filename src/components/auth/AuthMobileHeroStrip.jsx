import { motion, AnimatePresence } from "framer-motion";

const SLIDE_FADE = { duration: 0.75, ease: "easeInOut" };

/**
 * Compact rotating hero for small screens (synced with marketing slides).
 */
export function AuthMobileHeroStrip({ slides, activeIndex }) {
  const slide = slides[activeIndex % slides.length];
  if (!slide) return null;

  return (
    <div className="relative mb-8 h-44 w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-primary/15 lg:hidden">
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={SLIDE_FADE}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-violet-900/25 to-cyan-600/15" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-cyan-200/90">FitNova AI</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow-sm">{slide.headline}</p>
        <div className="mt-2 flex gap-1.5">
          {slides.map((s, i) => (
            <span
              key={s.src}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex % slides.length ? "w-5 bg-white" : "w-1 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
