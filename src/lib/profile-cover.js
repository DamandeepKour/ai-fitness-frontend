import { SITE_IMAGES } from "@/data/site-images";

const GOAL_COVERS = {
  weight_loss: SITE_IMAGES.runningSunrise,
  fat_loss: SITE_IMAGES.runnerCardio,
  maintenance: SITE_IMAGES.yogaBalance,
  muscle_gain: SITE_IMAGES.gymStrength,
};

const FALLBACK_COVERS = [
  SITE_IMAGES.outdoorWorkout,
  SITE_IMAGES.athleteTraining,
  SITE_IMAGES.gymDumbbells,
  SITE_IMAGES.stretching,
  SITE_IMAGES.gymCommunity,
];

function hashSeed(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash + value.charCodeAt(i) * (i + 1)) % FALLBACK_COVERS.length;
  }
  return hash;
}

export function getProfileAvatarUrl(user = {}) {
  return user.profileImageUrl || user.profile_picture || "";
}

export function getDefaultProfileCover(user = {}) {
  if (user.profile_cover_url) {
    return {
      image: user.profile_cover_url,
      alt: "Profile cover",
    };
  }

  const goal = String(user.goal || "").toLowerCase();
  if (GOAL_COVERS[goal]) {
    return {
      image: GOAL_COVERS[goal],
      alt: `${goal.replace(/_/g, " ")} fitness cover`,
    };
  }

  const seed = user.email || user.name || "fitnova";
  return {
    image: FALLBACK_COVERS[hashSeed(seed)],
    alt: "Fitness lifestyle cover",
  };
}

export function normalizeProfileUser(user = {}) {
  return {
    ...user,
    profileImageUrl: getProfileAvatarUrl(user),
  };
}
