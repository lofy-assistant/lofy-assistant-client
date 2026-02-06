export function BellIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main bell body - classic bell silhouette */}
      <path d="M 40 14 L 40 18 C 32 18 28 22 26 28 C 24 34 22 40 20 46 C 18 50 20 54 24 54 L 56 54 C 60 54 62 50 60 46 C 58 40 56 34 54 28 C 52 22 48 18 40 18 L 40 14 Z" fill="#0cae8b" />

      {/* Bell curves - adds dimension */}
      <path d="M 30 30 Q 40 26 50 30 L 50 46 Q 40 50 30 46 Z" fill="#088067" />

      {/* Highlight on left side - Favre style negative space */}
      <ellipse cx="32" cy="36" rx="6" ry="14" fill="#14d4a8" opacity="0.6" />

      {/* Top knob */}
      <circle cx="40" cy="14" r="4" fill="#066b54" />

      {/* Clapper */}
      <line x1="40" y1="38" x2="40" y2="50" stroke="#066b54" strokeWidth="2" />
      <circle cx="40" cy="50" r="4" fill="#066b54" />

      {/* Bottom rim wave */}
      <path d="M 24 54 Q 32 58 40 58 Q 48 58 56 54" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Motion lines - ringing effect */}
      <path d="M 14 30 Q 10 26 8 22" stroke="#0cae8b" strokeWidth="4" strokeLinecap="round" fill="none" />

      <path d="M 16 40 Q 12 38 10 34" stroke="#0cae8b" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />

      <path d="M 66 30 Q 70 26 72 22" stroke="#0cae8b" strokeWidth="4" strokeLinecap="round" fill="none" />

      <path d="M 64 40 Q 68 38 70 34" stroke="#0cae8b" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}
