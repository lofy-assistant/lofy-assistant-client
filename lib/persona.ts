/** Stored `ai_persona` values and profile dropdown options */
export type Persona = "atlas" | "brad" | "lexi" | "rocco";

export const PERSONA_OPTIONS: { value: Persona; label: string }[] = [
  { value: "atlas", label: "A.T.L.A.S, the Intelligent 🤖" },
  { value: "brad", label: "Brad, the Bro 🎸" },
  { value: "lexi", label: "Lexi, the Bestie 💅🏽" },
  { value: "rocco", label: "Rocco, the Roaster 🎤" },
];

/** Stable order for marketing grids and feature pages */
export const PERSONA_ORDER: Persona[] = ["atlas", "brad", "lexi", "rocco"];

/** Rich copy for landing, feature, and guide pages */
export type PersonaMarketing = {
  value: Persona;
  /** Display title without hero emoji (emoji shown separately in layouts) */
  cardTitle: string;
  /** Large emoji in persona cards / bento orbs */
  heroEmoji: string;
  description: string;
  examples: string[];
  colorClass: string;
  /** Short name for compact UI (bento orbs) */
  shortName: string;
  /** Lore / story cards on About & Guide */
  storyTagline: string;
  storyDesc: string;
};

const MARKETING: Record<Persona, Omit<PersonaMarketing, "value">> = {
  atlas: {
    cardTitle: "A.T.L.A.S, the Intelligent",
    heroEmoji: "🤖",
    description:
      "Composed, highly intelligent, and efficient. Cuts through the noise with clarity and precision—calm, articulate, and confident, a partner who anticipates your needs.",
    examples: [
      "Reminder set for 3 PM. You're clear until then.",
      "Added to calendar. You've got three events back-to-back tomorrow — buffer time might help.",
      "Memory stored. I'll remember that.",
    ],
    colorClass: "bg-slate-500/10 border-slate-500/20",
    shortName: "A.T.L.A.S",
    storyTagline: "Intelligent clarity",
    storyDesc: "Fast, structured, no friction.",
  },
  brad: {
    cardTitle: "Brad, the Bro",
    heroEmoji: "🎸",
    description:
      "Confident, playful, and chill—the bro who always has your back. Light teasing, friendly tone, and quick help. Riffs on the situation, never on you.",
    examples: [
      "Alright alright, reminder set. I got you.",
      "Done. Bold of you to trust me again—but I deliver.",
      "On it. What are friends for?",
    ],
    colorClass: "bg-amber-500/10 border-amber-500/20",
    shortName: "Brad",
    storyTagline: "The Bro",
    storyDesc: "Confident, playful, loyal.",
  },
  lexi: {
    cardTitle: "Lexi, the Bestie",
    heroEmoji: "💅🏽",
    description:
      "Optimistic, resilient, and real—your bestie with boundaries. Steady through uncertainty, encouraging but honest—the voice that keeps you moving forward.",
    examples: [
      "Reminder set. One less thing to carry.",
      "There are risks. None of them are irreversible. Let's go step by step.",
      "I hear you. Here's what I'd do next.",
    ],
    colorClass: "bg-pink-500/10 border-pink-500/20",
    shortName: "Lexi",
    storyTagline: "The Bestie",
    storyDesc: "Warm, steady, forward-moving.",
  },
  rocco: {
    cardTitle: "Rocco, the Roaster",
    heroEmoji: "🎤",
    description:
      "Sharp, quick, and hilarious on the mic—roasts the moment, not you. Discreet when it counts, memorable when you need a laugh. Loyal hype with edge.",
    examples: [
      "Reminder set. I'll hold you to it—fair warning.",
      "Calendar updated. Tomorrow's stacked; pace yourself, superstar.",
      "Saved. Don't say I never remember the important stuff.",
    ],
    colorClass: "bg-purple-500/10 border-purple-500/20",
    shortName: "Rocco",
    storyTagline: "The Roaster",
    storyDesc: "Witty, direct, never cruel.",
  },
};

export function getPersonaMarketing(value: Persona): PersonaMarketing {
  const m = MARKETING[value];
  return { value, ...m };
}

export const PERSONA_MARKETING_LIST: PersonaMarketing[] = PERSONA_ORDER.map((value) =>
  getPersonaMarketing(value)
);

const ALLOWED = new Set<string>(["atlas", "brad", "lexi", "rocco"]);

/** Map legacy persona strings from DB to current personas */
const LEGACY_TO_PERSONA: Record<string, Persona> = {
  atlas: "atlas",
  brad: "brad",
  lexi: "lexi",
  rocco: "rocco",
  nice: "lexi",
  lofy: "lexi",
  hope: "lexi",
  sarcastic: "rocco",
  chancellor: "rocco",
  mean: "atlas",
  sassy: "brad",
};

export function normalizePersonaFromDb(raw: string | null | undefined): Persona {
  if (!raw) return "atlas";
  const key = raw.toLowerCase();
  if (ALLOWED.has(key)) return key as Persona;
  return LEGACY_TO_PERSONA[key] ?? "atlas";
}

/** Normalize PATCH body `type` to a valid persona, or null if invalid */
export function normalizePersonaFromRequest(type: unknown): Persona | null {
  if (typeof type !== "string") return null;
  const key = type.toLowerCase();
  if (ALLOWED.has(key)) return key as Persona;
  return LEGACY_TO_PERSONA[key] ?? null;
}
