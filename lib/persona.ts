/** Stored `ai_persona` values and profile dropdown options */
export type Persona = "atlas" | "brad" | "lexi" | "rocco";

export const PERSONA_OPTIONS: { value: Persona; label: string }[] = [
  { value: "atlas", label: "Atlas" },
  { value: "brad", label: "Brad" },
  { value: "lexi", label: "Lexi" },
  { value: "rocco", label: "Rocco" },
];

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
