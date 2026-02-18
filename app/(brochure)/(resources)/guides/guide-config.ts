import { Brain, Bell, Calendar, MessageSquare, Lightbulb, HelpCircle, Rocket, Plug, User, Cat } from "lucide-react";

export const GUIDE_SECTIONS = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "messaging", label: "Text, Voice & Images", icon: MessageSquare },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "calendar", label: "Calendar Events", icon: Calendar },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "memory", label: "Memory Storage & Recall", icon: Brain },
  { id: "personas", label: "Personas", icon: User },
  { id: "story", label: "The Lofy Origin", icon: Cat },
  { id: "quick-tips", label: "Quick Tips", icon: Lightbulb },
  { id: "help", label: "Need Help?", icon: HelpCircle },
] as const;

export type GuideSectionId = (typeof GUIDE_SECTIONS)[number]["id"];

export const GUIDE_BASE_PATH = "/guides";

export function getSectionIndex(id: string): number {
  return GUIDE_SECTIONS.findIndex((s) => s.id === id);
}

export function getPrevSection(id: string): GuideSectionId | null {
  const idx = getSectionIndex(id);
  if (idx <= 0) return null;
  return GUIDE_SECTIONS[idx - 1].id;
}

export function getNextSection(id: string): GuideSectionId | null {
  const idx = getSectionIndex(id);
  if (idx < 0 || idx >= GUIDE_SECTIONS.length - 1) return null;
  return GUIDE_SECTIONS[idx + 1].id;
}

export function isValidSection(id: string): id is GuideSectionId {
  return GUIDE_SECTIONS.some((s) => s.id === id);
}
