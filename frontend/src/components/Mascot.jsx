/*
  Brand mascot — a minimalist line-art Parasaurolophus.
  Used sparingly: empty states, onboarding, loading and transition
  moments, and the odd micro-interaction. Never as decoration.

  variant="idle"    — gentle breathing sway (default)
  variant="loading"  — faster sway, reads as "thinking"
  variant="still"    — no animation (respects prefers-reduced-motion too)
*/

export default function Mascot({ size = 96, variant = "idle", className = "" }) {
  return (
    <svg
      width={size}
      height={(size * 160) / 240}
      viewBox="0 0 240 160"
      fill="none"
      className={`mascot mascot-${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      <g className="mascot-body">
        {/* Legs (behind body line) */}
        <path
          className="mascot-leg"
          d="M78 100 L74 142 M67 142 L82 142"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="mascot-leg mascot-leg-front"
          d="M150 88 L146 142 M137 142 L154 142"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Body / neck / head / crest / bill silhouette */}
        <path
          d="M14 128
             C 12 118 30 112 40 118
             C 48 122 58 120 74 96
             C 84 80 96 70 110 68
             C 122 66 132 62 140 58
             C 144 48 150 40 158 26
             C 162 18 168 16 168 16
             C 172 8 186 4 198 6
             C 206 7.5 210 14 210 20
             C 210 26 200 24 188 22
             C 182 21 178 18 182 14
             C 196 14 212 22 222 32
             C 214 40 202 44 192 48
             C 184 58 176 62 170 64
             C 160 74 152 80 150 88
             C 146 96 138 100 128 102
             C 112 106 98 104 88 108
             C 74 113 62 116 60 118
             C 46 124 30 126 14 128 Z"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Eye */}
        <circle className="mascot-eye" cx="176" cy="25" r="2.1" fill="currentColor" />
      </g>
    </svg>
  );
}
