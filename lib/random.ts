/**
 * Generates a pseudo-random number between 0 (inclusive) and 1 (exclusive)
 * using a Mulberry32 algorithm seeded with the current timestamp (salt).
 */
export function seededRandom(): number {
  // Use current timestamp as the initial seed (salt).
  // We add Math.random() to ensure uniqueness if called multiple times in the exact same millisecond.
  let seed = Date.now() + Math.floor(Math.random() * 100000);
  
  // Mulberry32 PRNG algorithm
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min)) + min;
}

/**
 * Returns a random element from an array.
 */
export function getRandomElement<T>(array: T[]): T {
  if (!array || array.length === 0) {
    throw new Error("Cannot get random element from empty array");
  }
  return array[getRandomInt(0, array.length)];
}
