import { createHash } from "crypto";
import * as fernet from "fernet";

/**
 * Hash sensitive data using SHA-256 to check for existence.
 * @param data The string data to hash.
 * @returns The SHA-256 hex digest string.
 */
export function hash(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

/**
 * Decrypt content that was encrypted using Fernet encryption.
 * @param encryptedContent The encrypted content string.
 * @returns The decrypted content string.
 */
export function decryptContent(encryptedContent: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  const secret = new fernet.Secret(encryptionKey);
  const token = new fernet.Token({
    secret: secret,
    ttl: 0, // Disable TTL check to match Python behavior
  });

  return token.decode(encryptedContent);
}
