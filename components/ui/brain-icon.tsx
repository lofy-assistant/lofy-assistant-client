export function BrainIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left hemisphere */}
      <path d="M 32 16 C 28 16 24 18 22 22 C 20 26 20 30 20 34 C 20 38 20 44 22 48 C 24 52 26 56 30 58 C 32 59 36 60 38 60 L 38 16 C 36 16 34 16 32 16 Z" fill="#0cae8b" />

      {/* Right hemisphere */}
      <path d="M 48 16 C 52 16 56 18 58 22 C 60 26 60 30 60 34 C 60 38 60 44 58 48 C 56 52 54 56 50 58 C 48 59 44 60 42 60 L 42 16 C 44 16 46 16 48 16 Z" fill="#0cae8b" />

      {/* Left hemisphere folds - darker shade */}
      <path d="M 26 24 Q 24 28 24 32 Q 24 36 26 40 Q 28 44 30 48" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      <path d="M 30 22 Q 28 28 28 34 Q 28 40 30 46 Q 32 50 34 54" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Right hemisphere folds */}
      <path d="M 54 24 Q 56 28 56 32 Q 56 36 54 40 Q 52 44 50 48" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      <path d="M 50 22 Q 52 28 52 34 Q 52 40 50 46 Q 48 50 46 54" stroke="#088067" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Center division line */}
      <line x1="40" y1="16" x2="40" y2="60" stroke="#066b54" strokeWidth="2" />

      {/* Highlight curves on left - Favre style */}
      <path d="M 22 26 Q 20 30 20 34 Q 20 38 22 42" stroke="#14d4a8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />

      {/* Top rounded sections */}
      <circle cx="32" cy="18" r="6" fill="#088067" />
      <circle cx="48" cy="18" r="6" fill="#088067" />

      {/* Top highlights */}
      <circle cx="30" cy="16" r="3" fill="#14d4a8" opacity="0.6" />
      <circle cx="50" cy="16" r="3" fill="#14d4a8" opacity="0.6" />

      {/* Energy sparks - thinking activity */}
      <circle cx="18" cy="28" r="3" fill="#0cae8b" />
      <circle cx="14" cy="36" r="2" fill="#0cae8b" opacity="0.7" />
      <circle cx="16" cy="44" r="2.5" fill="#0cae8b" opacity="0.8" />

      <circle cx="62" cy="28" r="3" fill="#0cae8b" />
      <circle cx="66" cy="36" r="2" fill="#0cae8b" opacity="0.7" />
      <circle cx="64" cy="44" r="2.5" fill="#0cae8b" opacity="0.8" />

      {/* Connecting lines for sparks */}
      <line x1="18" y1="28" x2="22" y2="30" stroke="#0cae8b" strokeWidth="2" opacity="0.5" />
      <line x1="14" y1="36" x2="20" y2="36" stroke="#0cae8b" strokeWidth="1.5" opacity="0.5" />

      <line x1="62" y1="28" x2="58" y2="30" stroke="#0cae8b" strokeWidth="2" opacity="0.5" />
      <line x1="66" y1="36" x2="60" y2="36" stroke="#0cae8b" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}
