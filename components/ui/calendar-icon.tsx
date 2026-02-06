export function CalendarIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background shadow layer for depth */}
      <rect x="14" y="22" width="52" height="48" rx="10" fill="#088067" opacity="0.3" />

      {/* Main calendar body - with slight offset for 3D effect */}
      <rect x="12" y="18" width="52" height="48" rx="10" fill="url(#calendarGradient)" />

      {/* Header section with darker teal */}
      <rect x="12" y="18" width="52" height="16" rx="10" fill="#088067" />
      <rect x="12" y="26" width="52" height="8" fill="#088067" />

      {/* Left binding ring with shadow */}
      <circle cx="24" cy="14" r="5" fill="#066b54" />
      <circle cx="24" cy="13" r="5" fill="#0cae8b" />
      <circle cx="24" cy="13" r="2.5" fill="#ffffff" opacity="0.9" />

      {/* Right binding ring with shadow */}
      <circle cx="52" cy="14" r="5" fill="#066b54" />
      <circle cx="52" cy="13" r="5" fill="#0cae8b" />
      <circle cx="52" cy="13" r="2.5" fill="#ffffff" opacity="0.9" />

      {/* Date dots - playful arrangement with motion */}
      <g transform="translate(0, -1)">
        {/* First row */}
        <circle cx="22" cy="42" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="32" cy="42" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="42" cy="42" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="52" cy="42" r="3" fill="#0cae8b" opacity="0.5" />

        {/* Second row */}
        <circle cx="22" cy="52" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="32" cy="52" r="3.5" fill="#0cae8b" opacity="0.7" />
        <circle cx="42" cy="52" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="52" cy="52" r="3" fill="#0cae8b" opacity="0.5" />

        {/* Third row */}
        <circle cx="22" cy="62" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="32" cy="62" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="42" cy="62" r="3" fill="#0cae8b" opacity="0.5" />
        <circle cx="52" cy="62" r="3" fill="#0cae8b" opacity="0.5" />
      </g>

      {/* Playful accent curve - adds motion */}
      <path d="M 16 34 Q 38 31 60 34" stroke="#0cae8b" strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Highlight shine on top left */}
      <ellipse cx="22" cy="24" rx="8" ry="4" fill="#ffffff" opacity="0.25" />

      <defs>
        {/* Gradient for main body */}
        <linearGradient id="calendarGradient" x1="12" y1="18" x2="12" y2="66">
          <stop offset="0%" stopColor="#f0fdfb" />
          <stop offset="100%" stopColor="#e0f9f5" />
        </linearGradient>

        {/* Gradient for featured date */}
        <linearGradient id="featuredGradient" x1="42" y1="54" x2="42" y2="68">
          <stop offset="0%" stopColor="#0cae8b" />
          <stop offset="100%" stopColor="#088067" />
        </linearGradient>
      </defs>
    </svg>
  );
}
