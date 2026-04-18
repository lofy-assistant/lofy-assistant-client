-- Default Google Calendar account per user (assistant + UI)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "default_google_credential_id" INTEGER;

DO $$
BEGIN
  ALTER TABLE "users"
    ADD CONSTRAINT "users_default_google_credential_id_fkey"
    FOREIGN KEY ("default_google_credential_id") REFERENCES "integration_credentials"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "users_default_google_credential_id_key" ON "users" ("default_google_credential_id");
