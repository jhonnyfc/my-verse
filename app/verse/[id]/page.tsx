import { AnimatedBackground } from "@/components/AnimatedBackground";
import { VerseCard } from "@/components/VerseCard";
import { getVerseFromId } from "@/services/verseService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function VersePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang } = await searchParams;
  
  // Default to English if no valid language is provided
  const validLang = (lang === "en" || lang === "es") ? lang : "en";
  
  const verse = await getVerseFromId(id, validLang);

  if (!verse) {
    notFound();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 overflow-hidden">
      <AnimatedBackground />
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center space-y-12">
        <div className="w-full flex justify-start">
          <Link 
            href="/" 
            className="group flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <VerseCard verse={verse} />
      </div>
    </main>
  );
}
