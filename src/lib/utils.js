export function cn(...inputs) {
  const out = [];

  const push = (value) => {
    if (!value) return;
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach(push);
    else if (typeof value === "object") {
      for (const [key, enabled] of Object.entries(value)) {
        if (enabled) out.push(key);
      }
    }
  };

  inputs.forEach(push);
  return out.join(" ");
}
