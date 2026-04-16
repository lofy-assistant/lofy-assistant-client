CREATE TABLE "memories_share" (
    "id" BIGSERIAL NOT NULL,
    "memory_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    CONSTRAINT "memories_share_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uq_memories_share_memory_user" ON "memories_share"("memory_id", "user_id");
CREATE INDEX "idx_memories_share_user_id" ON "memories_share"("user_id");
CREATE INDEX "idx_memories_share_memory_id" ON "memories_share"("memory_id");

ALTER TABLE "memories_share"
    ADD CONSTRAINT "memories_share_memory_id_fkey"
    FOREIGN KEY ("memory_id") REFERENCES "memories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "memories_share"
    ADD CONSTRAINT "memories_share_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;