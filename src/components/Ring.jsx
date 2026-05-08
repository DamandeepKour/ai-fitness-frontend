export function Ring({ value, max, size = 140, stroke = 14, gradient, trackOpacity = 0.15 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = c * (1 - pct);
  const id = `g-${gradient.replace(/\W/g, "")}`;
  const [start, end] = gradient.split("|");

  return (
    <svg width={size} height={size} className="-rotate-90">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={start} />
          <stop offset="100%" stopColor={end} />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`url(#${id})`}
        strokeOpacity={trackOpacity}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`url(#${id})`}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.8,.2,1)" }}
      />
    </svg>
  );
}
