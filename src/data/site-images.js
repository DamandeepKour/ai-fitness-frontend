/**
 * Verified Unsplash URLs (same pool as login/signup slides).
 * Some photo IDs 404 on Unsplash — only use IDs already used elsewhere in this app.
 */
export function unsplash(photoId, width = 800) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export const SITE_IMAGES = {
  healthyBowl: unsplash("1490645935967-10de6ba17061"),
  freshVeggies: unsplash("1547592180-85f173990554"),
  yogaBalance: unsplash("1506126613408-eca07ce68773"),
  runningSunrise: unsplash("1476480862126-209bfaa8edc8"),
  saladSpread: unsplash("1512621776951-a57141f2eefd"),
  gymStrength: unsplash("1517836357463-d25dfeac3438"),
  athleteTraining: unsplash("1571019614242-c5c5dee9f50b"),
  stretching: unsplash("1544367567-0f2fcb009e0b"),
  gymDumbbells: unsplash("1534438327276-14e5300c3a48"),
  outdoorWorkout: unsplash("1599058945522-28ba584b771f"),
  pokeBowl: unsplash("1546069901-ba9599a7e63c"),
  greenSalad: unsplash("1540420773420-3366772f4999"),
  pizzaMeal: unsplash("1565299624946-b28f40a0ae38"),
  salmonPlate: unsplash("1467003909585-2f8a72700288"),
  runnerCardio: unsplash("1546483875-ad9014c88eba"),
  gymCommunity: unsplash("1517838277536-f5f99be501cd"),
  heroFeatures: unsplash("1571019614242-c5c5dee9f50b", 1200),
  ctaGym: unsplash("1517838277536-f5f99be501cd", 1200),
};

/** Default if a remote image fails to load */
export const IMAGE_FALLBACK = SITE_IMAGES.healthyBowl;
