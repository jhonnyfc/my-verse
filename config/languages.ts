export type SupportedLanguage = "en" | "es";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  // The translation ID used by the Free Use Bible API (helloao.org)
  helloAoTranslationId: string;
  // The translation ID used by YouVersion (bible.com) for external links
  youVersionId: string;
  labels: {
    discoverVerse: string;
    readFullChapter: string;
  };
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    helloAoTranslationId: "BSB", // Berean Standard Bible
    youVersionId: "111", // NIV
    labels: {
      discoverVerse: "Discover Today's Verse",
      readFullChapter: "Read full chapter",
    },
  },
  es: {
    code: "es",
    name: "Español",
    helloAoTranslationId: "spa_r09", // Reina-Valera 1909
    youVersionId: "149", // RVR1960
    labels: {
      discoverVerse: "Descubrir Versículo de Hoy",
      readFullChapter: "Leer capítulo completo",
    },
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
