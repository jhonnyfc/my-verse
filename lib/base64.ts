/**
 * Encodes a string to base64url format.
 */
export function encodeBase64Url(str: string): string {
  return Buffer.from(str).toString("base64url");
}

/**
 * Decodes a base64url string to utf-8 format.
 */
export function decodeBase64Url(str: string): string {
  return Buffer.from(str, "base64url").toString("utf-8");
}
