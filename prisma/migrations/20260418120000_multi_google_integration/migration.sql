-- Multi-account Google Calendar: named credentials + per-event source account
ALTER TABLE "integration_credentials" ADD COLUMN IF NOT EXISTS "display_name" TEXT;

ALTER TABLE "calendar_events" ADD COLUMN IF NOT EXISTS "google_credential_id" INTEGER;

CREATE INDEX IF NOT EXISTS "idx_calendar_events_google_credential_id" ON "calendar_events" ("google_credential_id");
