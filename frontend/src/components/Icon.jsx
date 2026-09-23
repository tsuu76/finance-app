/*
  CashFlo icon system — a single hand-drawn line-icon set.
  Every icon shares the same stroke weight, cap and join so the whole
  app reads as one system instead of a grab-bag of emoji.
  Usage: <Icon name="wallet" size={18} />
*/

const PATHS = {
  // ── Core financial concepts ──
  wallet: "M3 7.5a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 7.5V17a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2Z M16 13.2h2.2",
  "trend-up": "M3 16.5 9.5 10l4 4L21 6M21 6h-5.5M21 6v5.5",
  "trend-down": "M3 7.5 9.5 14l4-4L21 18M21 18h-5.5M21 18v-5.5",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  sparkle: "M12 3.5 13.4 9 19 10.4 13.4 11.8 12 17.3 10.6 11.8 5 10.4 10.6 9 12 3.5Z M18.5 15.5l.6 1.8 1.9.6-1.9.6-.6 1.8-.6-1.8-1.9-.6 1.9-.6.6-1.8Z",
  chat: "M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4.4 3.3a.5.5 0 0 1-.8-.4V16a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  plus: "M12 5v14M5 12h14",
  close: "M6 6l12 12M18 6 6 18",
  check: "M4.5 12.5 9 17l10.5-11",
  "check-circle": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M8 12.3l2.6 2.6L16.2 9",
  warning: "M12 3.5 21.5 20h-19L12 3.5Z M12 9.8v4.3 M12 17.1h.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 11v5.5 M12 7.6h.01",
  "arrow-right": "M4.5 12h15M13.5 6l6 6-6 6",
  "chevron-down": "M6 9.5 12 15l6-5.5",
  edit: "M14.5 4.5 19 9l-9.5 9.5H5v-4.5L14.5 4.5Z",
  trash: "M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2m-8.5 0 1 12.2a1 1 0 0 0 1 .8h7l1-13M10 11v6M14 11v6",
  skip: "M5 6.5v11l8.5-5.5Zm10.5 0v11h3v-11Z",
  shield: "M12 3.5 19.5 6.5v5.3c0 4.8-3.2 7.9-7.5 9.7-4.3-1.8-7.5-4.9-7.5-9.7V6.5L12 3.5Z",
  seedling: "M12 21v-7.5M12 13.5C7.5 13.5 5 11 5 6.5c4.7 0 7 2.3 7 7Zm0 0C16.5 13.5 19 11 19 6.5c-4.7 0-7 2.3-7 7Z",

  // ── Nav ──
  home: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9",
  grid: "M4 4h7v7H4Zm9 0h7v7h-7ZM4 13h7v7H4Zm9 0h7v7h-7Z",
  flag: "M6 21V4M6 4.5h10.5l-2.6 3.5 2.6 3.5H6",

  // ── Expense categories ──
  food: "M6 3.5v7.8a2.2 2.2 0 0 0 4.4 0V3.5M8.2 3.5v20M17 3.5c-1.8 0-3 2-3 5.5 0 2.4 1 3.8 2 4.2v10.3M17 3.5c1.8 0 3 2 3 5.5 0 2.4-1 3.8-2 4.2",
  transport: "M5 16h14M5 16V9.5l1.8-4.2a1 1 0 0 1 .9-.6h8.6a1 1 0 0 1 .9.6L19 9.5V16M5 16v3a1 1 0 0 0 1 1h1.3a1 1 0 0 0 1-1v-1.3h7.4V19a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-3M7.5 12.5h9M7.7 16h.01M16.3 16h.01",
  shopping: "M6.5 8h11l1 12.5a1 1 0 0 1-1 1.1H6.5a1 1 0 0 1-1-1.1L6.5 8Z M9 8V6.5a3 3 0 0 1 6 0V8",
  entertainment: "M4 6h16v11H4Z M4 17l4 3.5M20 17l-4 3.5M9.7 8.7l4.8 2.8-4.8 2.8Z",
  bills: "M6 3h12v18l-2.5-1.6L13 21l-1.5-1.6L10 21l-2.5-1.6L6 21Z M8.5 8h7M8.5 11h7M8.5 14h4",
  house: "M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9M10 20v-6h4v6",
  health: "M12 21s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.8 4.5 4.5 0 0 1 19.5 11c0 5.4-7.5 10-7.5 10ZM9.5 11h5M12 8.5v5",
  subscriptions: "M4 12a8 8 0 0 1 13.4-5.9M20 12a8 8 0 0 1-13.4 5.9M17 3v3.5h-3.5M7 21v-3.5h3.5",
  clothing: "M9 4 6 6.5 4 9.5l2.5 1.8V20h11v-8.7L20 9.5 18 6.5 15 4a3 3 0 0 1-6 0Z",
  education: "M2.5 8.5 12 4l9.5 4.5-9.5 4.5-9.5-4.5Zm4.5 2.6V17c0 1.4 2.3 3 5 3s5-1.6 5-3v-5.9",
  utilities: "M13 3 5 13.5h5.5L11 21l8-11.5h-5.5Z",
  laptop: "M5 5.5h14v9H5ZM3 18.5h18a1 1 0 0 0 1-1v-.5H2v.5a1 1 0 0 0 1 1Z",
  vacation: "M4 18.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0M12 3.5v11M8 7.5h8M6.5 15 12 6l5.5 9",
  car: "M5 16h14M5 16V9.5l1.8-4.2a1 1 0 0 1 .9-.6h8.6a1 1 0 0 1 .9.6L19 9.5V16M7.7 16h.01M16.3 16h.01M5 16v3a1 1 0 0 0 1 1h1.3a1 1 0 0 0 1-1v-1.3h7.4V19a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-3",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7.5V12l3.3 2",
  savings: "M4 12.5c0-4.5 3.6-8 8.3-8 3 0 5 1.5 6.2 3h2l-1.3 2.3L20.5 12h-2c-.2 2-1 3.4-2.2 4.4V20h-3v-2h-2v2h-3v-3.8c-1.9-1-3.8-2.8-3.8-5.7Zm5-3.2h.01",
  other: "M4 8.5 12 4l8 4.5v7L12 20l-8-4.5Zm0 0L12 13m0 7v-7m8-4.5L12 13",
  bank: "M3.5 9.5 12 4l8.5 5.5M4.5 9.5h15M6 9.5V19M10 9.5V19M14 9.5V19M18 9.5V19M3.5 19h17",
};

const VIEWBOX_OVERRIDE = {};

export default function Icon({ name, size = 20, strokeWidth = 1.6, className = "", title }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={VIEWBOX_OVERRIDE[name] || "0 0 24 24"}
      fill="none"
      className={`icon icon-${name} ${className}`.trim()}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
