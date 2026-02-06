export function BrainIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left hemisphere */}
      <path d="M 32 20 C 28 20 24 22 22 26 C 20 30 20 34 20 38 C 20 42 20 48 22 52 C 24 56 26 60 30 62 C 32 63 36 64 38 64 L 38 20 C 36 20 34 20 32 20 Z" fill="#0cae8b" />

      {/* Right hemisphere */}
      <path d="M 48 20 C 52 20 56 22 58 26 C 60 30 60 34 60 38 C 60 42 60 48 58 52 C 56 56 54 60 50 62 C 48 63 44 64 42 64 L 42 20 C 44 20 46 20 48 20 Z" fill="#0cae8b" />

      {/* Left hemisphere folds - darker shade */}
      <path d="M 26 28 Q 24 32 24 36 Q 24 40 26 44 Q 28 48 30 52" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      <path d="M 30 26 Q 28 32 28 38 Q 28 44 30 50 Q 32 54 34 58" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Right hemisphere folds */}
      <path d="M 54 28 Q 56 32 56 36 Q 56 40 54 44 Q 52 48 50 52" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      <path d="M 50 26 Q 52 32 52 38 Q 52 44 50 50 Q 48 54 46 58" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Center division line */}
      <line x1="40" y1="20" x2="40" y2="64" stroke="#066b54" strokeWidth="2" />

      {/* Highlight curves on left - Favre style */}
      <path d="M 22 30 Q 20 34 20 38 Q 20 42 22 46" stroke="#14d4a8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />

      {/* Top rounded sections */}
      <circle cx="32" cy="22" r="6" fill="#088067" />
      <circle cx="48" cy="22" r="6" fill="#088067" />

      {/* Top highlights */}
      <circle cx="30" cy="20" r="3" fill="#14d4a8" opacity="0.6" />
      <circle cx="50" cy="20" r="3" fill="#14d4a8" opacity="0.6" />

      {/* Energy sparks - thinking activity */}
      <circle cx="18" cy="32" r="3" fill="#0cae8b" />
      <circle cx="14" cy="40" r="2" fill="#0cae8b" opacity="0.7" />
      <circle cx="16" cy="48" r="2.5" fill="#0cae8b" opacity="0.8" />

      <circle cx="62" cy="32" r="3" fill="#0cae8b" />
      <circle cx="66" cy="40" r="2" fill="#0cae8b" opacity="0.7" />
      <circle cx="64" cy="48" r="2.5" fill="#0cae8b" opacity="0.8" />

      {/* Connecting lines for sparks */}
      <line x1="18" y1="32" x2="22" y2="34" stroke="#0cae8b" strokeWidth="2" opacity="0.5" />
      <line x1="14" y1="40" x2="20" y2="40" stroke="#0cae8b" strokeWidth="1.5" opacity="0.5" />

      <line x1="62" y1="32" x2="58" y2="34" stroke="#0cae8b" strokeWidth="2" opacity="0.5" />
      <line x1="66" y1="40" x2="60" y2="40" stroke="#0cae8b" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}
