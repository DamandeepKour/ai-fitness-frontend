const PROFILE_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile_number", label: "Mobile" },
  { key: "country_code", label: "Country code" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "height", label: "Height" },
  { key: "weight", label: "Weight" },
  { key: "goal", label: "Goal" },
  { key: "diet_type", label: "Diet" },
  { key: "activity_level", label: "Activity" },
];

function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

export function getProfileCompletion(user) {
  if (!user) {
    return { percent: 0, missing: PROFILE_FIELDS.map((f) => f.label), isComplete: false };
  }

  const missing = PROFILE_FIELDS.filter((field) => !isFilled(user[field.key])).map(
    (field) => field.label,
  );

  const percent = Math.round(
    ((PROFILE_FIELDS.length - missing.length) / PROFILE_FIELDS.length) * 100,
  );

  return {
    percent,
    missing,
    isComplete: missing.length === 0,
  };
}
