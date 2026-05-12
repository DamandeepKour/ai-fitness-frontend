import { useEffect, useState } from "react";

/**
 * @param {number} length
 * @param {number} intervalMs
 */
export function useRotatingIndex(length, intervalMs) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [length, intervalMs]);

  return index;
}
