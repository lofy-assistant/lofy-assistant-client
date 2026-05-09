/** Marketing funnel: pick a messaging channel before connecting. */
export const CHANNEL_PICKER_PATH = "/start" as const;

const DEFAULT_WHATSAPP_ENTRY_URL =
  "https://wa.me/60105043846?text=Hey%20Lofy!";

/** WhatsApp deep link after the user selects WhatsApp on `/start`. Override with `NEXT_PUBLIC_WHATSAPP_ENTRY_URL`. */
export function getWhatsAppEntryUrl(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_ENTRY_URL ?? DEFAULT_WHATSAPP_ENTRY_URL;
}
