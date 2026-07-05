"use client";

import { Card } from "@/components/ui/card";
import { type Verse } from "@/services/verseService";
import { motion } from "framer-motion";

interface VerseCardProps {
  verse: Verse;
}

export function VerseCard({ verse }: VerseCardProps) {
  return (
    <Card className="max-w-2xl w-full mx-auto relative overflow-hidden">
      {/* Subtle top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-8"
      >
        <p className="font-serif text-2xl md:text-4xl leading-relaxed tracking-wide text-neutral-100">
          "{verse.text}"
        </p>
        
        <div className="flex flex-col items-center space-y-2">
          <div className="h-px w-12 bg-white/20 mb-4" />
          <p className="text-sm md:text-base font-medium tracking-widest uppercase text-neutral-400">
            {verse.book} {verse.chapter}:{verse.verse}
          </p>
        </div>
      </motion.div>
    </Card>
  );
}
