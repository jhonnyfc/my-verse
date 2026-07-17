"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  text?: string;
  title?: string;
  className?: string;
}

export function ShareButton({ text, title, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title,
      text,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "group flex items-center text-sm font-medium text-neutral-400 text-white transition-colors",
        className,
      )}
    >
      {copied ? (
        <>
          Copied
          <Check className="w-4 h-4 ml-1.5 transition-transform" />
        </>
      ) : (
        <>
          Share
          <Share2 className="w-4 h-4 ml-1.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </>
      )}
    </button>
  );
}
