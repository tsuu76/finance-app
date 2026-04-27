export default function Logo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CashFlo logo"
    >
      {/* Circle background */}
      <circle cx="20" cy="20" r="20" fill="#1a2e1a" />

      {/* Upward flow arrow */}
      <path
        d="M20 30 L20 14"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M13 20 L20 13 L27 20"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dollar curve */}
      <path
        d="M15 26 Q20 28 25 26"
        stroke="#86efac"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
