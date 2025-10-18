import type { CollectionEntry } from "astro:content";
import crypto from "node:crypto";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58EncodeBytes(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";
  // Convert base-256 bytes to base-58 digits
  const digits: number[] = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      const x = digits[j] * 256 + carry;
      digits[j] = x % 58;
      carry = Math.floor(x / 58);
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }
  // Handle leading zero bytes
  let leadingZeroCount = 0;
  while (leadingZeroCount < bytes.length && bytes[leadingZeroCount] === 0) {
    leadingZeroCount++;
  }
  let result = "";
  for (let i = 0; i < leadingZeroCount; i++) result += BASE58_ALPHABET[0];
  for (let i = digits.length - 1; i >= 0; i--) result += BASE58_ALPHABET[digits[i]];
  return result;
}

function formatDateYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * Generate a deterministic base58 slug based on "YYYYMMDD-Title".
 * - Uses base58 alphabet which excludes confusing characters: 0, O, I, l.
 * - Default fixed length is 8 characters.
 */
export function generateSlugFrom(title: string, published: Date): string {
  const base = `${formatDateYYYYMMDD(published)}-${title}`;
  const bytes = new TextEncoder().encode(base);
  let encoded = base58EncodeBytes(bytes);
  // Extra safety: strip any confusing chars if present (should not be in standard base58)
  encoded = encoded.replace(/[0OlI]/g, "");

  // Deterministic pseudo-random based on MD5
  const hash = crypto.createHash("md5").update(bytes).digest();
  const length = 8; // default fixed length
  const maxStart = Math.max(0, encoded.length - length);
  const start = maxStart > 0 ? (hash[1] % maxStart) : 0;

  const slug = encoded.slice(start, start + length);
  return slug || encoded.slice(0, Math.min(8, encoded.length)) || "post";
}

export function generateEntrySlug(entry: CollectionEntry<"posts">): string {
  return generateSlugFrom(entry.data.title, entry.data.published);
}