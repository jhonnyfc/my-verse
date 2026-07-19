"use client";

import { useState, useEffect } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { getRandomVerseId } from "@/services/verseService";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, Globe } from "lucide-react";
import {
  LANGUAGES,
  SupportedLanguage,
  DEFAULT_LANGUAGE,
} from "@/config/languages";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  // Load saved system language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("system_lang") as SupportedLanguage;
    if (savedLang && Object.keys(LANGUAGES).includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  // Update system language when selected
  function handleLangChange(newLang: SupportedLanguage) {
    setLang(newLang);
    localStorage.setItem("system_lang", newLang);
  }

  async function handleDiscover() {
    setLoading(true);

    const today = new Date().toDateString();
    const storageDateKey = `daily_verse_date`;
    const storageIdKey = `daily_verse_id`;

    const savedDate = localStorage.getItem(storageDateKey);
    const savedId = localStorage.getItem(storageIdKey);

    // If we already generated a verse today, load it immediately with the selected language
    if (savedDate === today && savedId) {
      router.push(`/verse/${savedId}?lang=${lang}`);
      return;
    }

    try {
      // Otherwise, generate a new language-agnostic ID from the server action
      const newId = await getRandomVerseId();

      // Save it in local storage so it persists for the rest of the day globally
      localStorage.setItem(storageDateKey, today);
      localStorage.setItem(storageIdKey, newId);

      router.push(`/verse/${newId}?lang=${lang}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  const currentLangConfig = LANGUAGES[lang];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 overflow-hidden">
      <AnimatedBackground />
      <Analytics />

      {/* Header with Language Selector */}

      <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-12">
        <div className="z-20 flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg animate-fade-in-up">
          <Globe className="w-4 h-4 ml-3 text-neutral-400" />
          <select
            value={lang}
            onChange={(e) =>
              handleLangChange(e.target.value as SupportedLanguage)
            }
            className="bg-transparent text-sm font-medium text-neutral-200 outline-none cursor-pointer pr-3 py-1.5 focus:ring-0 appearance-none"
          >
            {Object.values(LANGUAGES).map((config) => (
              <option
                key={config.code}
                className="bg-neutral-900"
                value={config.code}
              >
                {config.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className="flex flex-col items-center space-y-4 animate-fade-in-up"
          style={{ animationDuration: "1s", animationFillMode: "both" }}
        >
          <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md mb-2 shadow-xl ring-1 ring-white/10">
            <BookOpen className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 pb-2">
            Verse
          </h1>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
          style={{
            animationDelay: "0.2s",
            animationDuration: "1s",
            animationFillMode: "both",
          }}
        >
          <Button
            onClick={handleDiscover}
            disabled={loading}
            size="lg"
            className="w-full sm:w-auto shadow-2xl shadow-white/10"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              currentLangConfig.labels.discoverVerse
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
