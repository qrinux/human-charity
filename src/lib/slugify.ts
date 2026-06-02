// src/lib/slugify.ts
// Converts any string (Bengali, Arabic, etc.) to a clean URL slug

import anyAscii from "any-ascii";

export function generateSlug(text: string): string {
  return anyAscii(text)          // Transliterate Bengali → ASCII (e.g. "খাদ্য বিতরণ" → "khadya bitaran")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars
    .replace(/\s+/g, "-")          // Spaces → hyphens
    .replace(/-+/g, "-")           // Collapse multiple hyphens
    .replace(/^-+|-+$/g, "");      // Trim leading/trailing hyphens
}