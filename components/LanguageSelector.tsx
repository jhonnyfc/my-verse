"use client";

import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { LANGUAGES, SupportedLanguage } from "@/config/languages";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="z-20 relative animate-fade-in-up">
      {/* Mobile Native Select */}
      <div className="md:hidden flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
        <Globe className="w-4 h-4 ml-3 text-neutral-400" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SupportedLanguage)}
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

      {/* Desktop Custom Dropdown */}
      <div className="hidden md:block relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md border border-white/10 rounded-full py-2 px-4 shadow-lg text-sm font-medium text-neutral-200 outline-none focus:ring-2 focus:ring-white/20"
        >
          <Globe className="w-4 h-4 text-neutral-400" />
          <span>{LANGUAGES[value]?.name || "Language"}</span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl z-20 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-200">
              {Object.values(LANGUAGES).map((config) => (
                <button
                  key={config.code}
                  onClick={() => {
                    onChange(config.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-sm rounded-xl transition-all ${
                    value === config.code
                      ? "bg-white/10 text-white font-medium shadow-sm"
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
