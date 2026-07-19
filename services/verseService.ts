"use server";

import { getRandomElement, getRandomInt } from "@/lib/random";
import { encodeBase64Url, decodeBase64Url } from "@/lib/base64";
import {
  LANGUAGES,
  SupportedLanguage,
  DEFAULT_LANGUAGE,
} from "@/config/languages";

export type Verse = {
  language: string;
  bookId: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

// A curated list of books and their total chapter counts for the randomizer
const BOOKS = [
  { id: "GEN", name: "Genesis", chapters: 50 },
  { id: "PSA", name: "Psalms", chapters: 150 },
  { id: "PRO", name: "Proverbs", chapters: 31 },
  { id: "ISA", name: "Isaiah", chapters: 66 },
  { id: "MAT", name: "Matthew", chapters: 28 },
  { id: "JHN", name: "John", chapters: 21 },
  { id: "ROM", name: "Romans", chapters: 16 },
  { id: "EPH", name: "Ephesians", chapters: 6 },
  { id: "PHP", name: "Philippians", chapters: 4 },
  { id: "JAS", name: "James", chapters: 5 },
];

export async function getRandomVerseId(): Promise<string> {
  // Use BSB (English) just to get the chapter structure and pick a random verse number
  const translation = "BSB";

  // Pick a random book
  const randomBook = getRandomElement(BOOKS);

  // Pick a random chapter (1 to max chapters inclusive)
  const randomChapter = getRandomInt(1, randomBook.chapters + 1);

  try {
    // Fetch the chapter from the API to know how many verses it has
    const response = await fetch(
      `https://bible.helloao.org/api/${translation}/${randomBook.id}/${randomChapter}.json`,
      { cache: "no-store" }, // Ensure we always get fresh data
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chapter");
    }

    const data = await response.json();

    // Filter out headings, only get verses
    const verses: { number: number }[] = data.chapter.content.filter(
      (item: any) => item.type === "verse",
    );

    if (verses.length === 0) {
      throw new Error("No verses found in this chapter");
    }

    // Pick a random verse from the chapter
    const randomVerse = getRandomElement(verses);

    // Format the ID without the language. e.g., "JHN-3-16"
    const rawId = `${randomBook.id}-${randomChapter}-${randomVerse.number}`;
    return encodeBase64Url(rawId);
  } catch (error) {
    console.error("Error generating random verse ID:", error);
    // Fallback ID if the API fails
    const fallbackId = `JHN-3-16`;
    return encodeBase64Url(fallbackId);
  }
}

export async function getVerseFromId(
  id: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE,
): Promise<Verse | null> {
  try {
    let rawId = id;
    // If it doesn't look like a raw ID (e.g., JHN-3-16), assume it's base64url encoded
    try {
      rawId = decodeBase64Url(id);
    } catch (e) {
      console.error("Failed to decode base64url ID", e);
    }

    const [bookId, chapter, verseNumber] = rawId.split("-");

    if (!bookId || !chapter || !verseNumber) {
      return null;
    }

    const config = LANGUAGES[lang] || LANGUAGES[DEFAULT_LANGUAGE];
    const translation = config.helloAoTranslationId;

    // Fetch the specific chapter
    const response = await fetch(
      `https://bible.helloao.org/api/${translation}/${bookId}/${chapter}.json`,
      { cache: "force-cache" }, // We can cache this heavily since Bible text doesn't change
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Find the specific verse
    const verseObj = data.chapter.content.find(
      (item: any) =>
        item.type === "verse" && item.number === parseInt(verseNumber, 10),
    );

    if (!verseObj) {
      // In rare cases where translations have different verse mappings, fallback to verse 1
      const firstVerse = data.chapter.content.find(
        (item: any) => item.type === "verse",
      );
      if (!firstVerse) return null;

      const fallbackText = Array.isArray(firstVerse.content)
        ? firstVerse.content
            .map((c: any) => (typeof c === "string" ? c : c.text))
            .join("")
        : firstVerse.content;

      return {
        language: lang,
        bookId,
        book: data.book.name,
        chapter: parseInt(chapter, 10),
        verse: firstVerse.number,
        text: fallbackText,
      };
    }

    // Combine text if it's an array (sometimes verse content is split by formatting)
    const text = Array.isArray(verseObj.content)
      ? verseObj.content
          .map((c: any) => (typeof c === "string" ? c : c.text))
          .join("")
      : verseObj.content;

    // Use the localized book name from the API response
    const bookName = data.book.name;

    return {
      language: lang,
      bookId,
      book: bookName,
      chapter: parseInt(chapter, 10),
      verse: parseInt(verseNumber, 10),
      text,
    };
  } catch (error) {
    console.error("Error fetching verse:", error);
    return null;
  }
}
