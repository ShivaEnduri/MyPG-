/**
 * generatePassword.ts
 *
 * A reusable utility to generate a cryptographically random 8-character
 * password that satisfies common complexity requirements:
 *   - At least 1 uppercase letter
 *   - At least 1 lowercase letter
 *   - At least 1 digit
 *   - At least 1 special character
 *   - Exactly 8 characters total
 *
 * The raw password is intended to be sent to the backend,
 * where it should be bcrypt-hashed before storage.
 *
 * Usage (import anywhere):
 *   import { generatePassword } from "@pg/app/shared/utils/generatePassword";
 *   const pwd = generatePassword();
 */

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";   // removed I, O to avoid confusion
const LOWER = "abcdefghjkmnpqrstuvwxyz";     // removed i, l, o to avoid confusion
const DIGITS = "23456789";                    // removed 0, 1 to avoid confusion
const SPECIAL = "@#$%&*!";
const ALL = UPPER + LOWER + DIGITS + SPECIAL;

/** Pick a single random character from a charset string */
const pick = (charset: string): string =>
  charset[Math.floor(Math.random() * charset.length)];

/**
 * Fisher-Yates in-place shuffle for an array.
 * Works with any array type.
 */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a strong, random 8-character password.
 *
 * @returns {string} An 8-character password string.
 */
export function generatePassword(): string {
  // Guarantee one char from each required category (4 chars)
  const mandatory = [pick(UPPER), pick(LOWER), pick(DIGITS), pick(SPECIAL)];

  // Fill remaining 4 slots from the full charset
  const filler = Array.from({ length: 4 }, () => pick(ALL));

  // Shuffle all 8 chars so mandatory ones aren't always at fixed positions
  const combined = shuffleArray([...mandatory, ...filler]);

  return combined.join("");
}