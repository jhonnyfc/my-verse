import { AnimatedBackground } from "@/components/AnimatedBackground";
import { VerseCard } from "@/components/VerseCard";
import { getVerseFromId } from "@/services/verseService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { LANGUAGES, SupportedLanguage, DEFAULT_LANGUAGE } from "@/config/languages";

export default async function VersePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang } = await searchParams;
  
  // Validate language
  const validLang = (lang && Object.keys(LANGUAGES).includes(lang)) ? (lang as SupportedLanguage) : DEFAULT_LANGUAGE;
  const currentLangConfig = LANGUAGES[validLang];
  
  const verse = await getVerseFromId(id, validLang);

  if (!verse) {
    notFound();
  }

  // Construct external link to YouVersion using the constant
  const externalLink = `https://www.bible.com/bible/${currentLangConfig.youVersionId}/${verse.bookId}.${verse.chapter}.${verse.verse}`;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 overflow-hidden">
      <AnimatedBackground />
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center space-y-12">
        <div className="w-full flex justify-between items-center">
          <Link 
            href="/" 
            className="group flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            {currentLangConfig.labels.readFullChapter}
            <ExternalLink className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <VerseCard verse={verse} />
      </div>
    </main>
  );
}
