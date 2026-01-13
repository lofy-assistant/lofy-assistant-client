#!/usr/bin/env tsx

import dotenv from "dotenv";
import { decryptContent } from "../lib/encryption";

// Load environment variables from .env file
dotenv.config();

// Suppress console.warn temporarily to avoid noise from decryptContent
const originalWarn = console.warn;

console.warn = (...args: unknown[]) => {
  // Suppress the "Failed to decrypt content" warning from decryptContent
  // when we're intentionally trying base64 as fallback
  const message = args[0]?.toString() || "";
  if (message.includes("Failed to decrypt content")) {
    return; // Suppress this warning
  }
  originalWarn.apply(console, args);
};

/**
 * Decrypt a single encrypted string (tries Fernet first, then base64)
 */
function decryptString(encryptedString: string): { success: boolean; result: string; method: string; error?: string } {
  // Try Fernet decryption first
  try {
    const decrypted = decryptContent(encryptedString);

    // Check if decryption actually worked (if it returns the same string, it likely failed)
    if (decrypted === encryptedString) {
      // Fernet decryption failed, try base64 decoding
      try {
        const base64Decoded = Buffer.from(encryptedString, "base64").toString("utf8");
        return { success: true, result: base64Decoded, method: "base64" };
      } catch (base64Error) {
        return {
          success: false,
          result: encryptedString,
          method: "none",
          error: base64Error instanceof Error ? base64Error.message : String(base64Error),
        };
      }
    } else {
      return { success: true, result: decrypted, method: "fernet" };
    }
  } catch (error) {
    // If Fernet throws an error, try base64 as fallback
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("Invalid version") || errorMessage.includes("ENCRYPTION_KEY")) {
      // Try base64 decoding as fallback
      try {
        const base64Decoded = Buffer.from(encryptedString, "base64").toString("utf8");
        return { success: true, result: base64Decoded, method: "base64" };
      } catch (base64Error) {
        return {
          success: false,
          result: encryptedString,
          method: "none",
          error: base64Error instanceof Error ? base64Error.message : String(base64Error),
        };
      }
    } else {
      return {
        success: false,
        result: encryptedString,
        method: "none",
        error: errorMessage,
      };
    }
  }
}

// Get encrypted strings from command line arguments (skip node/tsx and script name)
const encryptedStrings = process.argv.slice(2);

if (encryptedStrings.length === 0) {
  console.error("Usage: tsx scripts/decrypt.ts <encrypted-string> [<encrypted-string> ...]");
  console.error("Example: tsx scripts/decrypt.ts gAAAAABh...");
  console.error("         tsx scripts/decrypt.ts NjAxMTU0MDIzODI5");
  console.error("         tsx scripts/decrypt.ts string1 string2 string3");
  process.exit(1);
}

// Process all strings
const results = encryptedStrings.map((encryptedString) => decryptString(encryptedString));

// Restore console.warn
console.warn = originalWarn;

// Display results
if (results.length === 1) {
  // Single result - detailed output
  const result = results[0];
  if (result.success) {
    if (result.method === "fernet") {
      console.log("\n✅ Fernet decryption successful!");
      console.log("Decrypted result:");
      console.log(result.result);
    } else {
      console.log("\n📝 Detected: Base64-encoded string (not Fernet encrypted)");
      console.log("✅ Decoded result:");
      console.log(result.result);
    }
    console.log();
  } else {
    console.error("\n❌ Failed to decrypt string:");
    console.error("Error:", result.error);
    console.error("Original string:", result.result);
    process.exit(1);
  }
} else {
  // Multiple results - table format
  console.log("\n📋 Decryption Results:\n");
  console.log("─".repeat(80));
  console.log(`${"#".padEnd(4)} ${"Encrypted (first 30 chars)".padEnd(32)} ${"Method".padEnd(10)} Result`);
  console.log("─".repeat(80));

  let hasErrors = false;
  results.forEach((result, index) => {
    const encryptedPreview = encryptedStrings[index].length > 30 ? encryptedStrings[index].substring(0, 27) + "..." : encryptedStrings[index];
    const method = result.success ? result.method.toUpperCase() : "ERROR";
    const status = result.success ? "✅" : "❌";

    console.log(`${String(index + 1).padEnd(4)} ${encryptedPreview.padEnd(32)} ${method.padEnd(10)} ${status} ${result.result}`);

    if (!result.success) {
      hasErrors = true;
      console.log(`     └─ Error: ${result.error}`);
    }
  });

  console.log("─".repeat(80));
  console.log(`\n✅ Successfully decrypted: ${results.filter((r) => r.success).length}/${results.length}`);

  if (hasErrors) {
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}/${results.length}`);
    process.exit(1);
  }
}
