"use client";

import { useState, useRef } from "react";
import { Languages } from "lucide-react";

type Language = "en" | "es";

interface LanguageToggleProps {
  onLanguageChange?: (language: Language) => void;
}

export function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [hasHovered, setHasHovered] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleToggle = () => {
    const newLanguage = currentLanguage === "en" ? "es" : "en";
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!hasHovered) {
      setHasHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex items-center bg-white rounded-full p-1 pr-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      aria-label={`Switch to ${currentLanguage === "en" ? "Spanish" : "English"}`}
    >
      {/* Language icon */}
      <Languages className="w-4 h-4 text-gray-600 ml-1.5 mr-1 flex-shrink-0" />
      
      {/* Toggle switch */}
      <div className="relative bg-gray-100 rounded-full p-0.5">
        {/* Sliding background with micro-interaction */}
        <div
          className={`absolute inset-y-0.5 w-1/2 bg-[#80bc00] rounded-full transition-transform ${
            hasHovered ? "duration-200" : "duration-500"
          } ${
            currentLanguage === "es" 
              ? "translate-x-full" 
              : "translate-x-0"
          } ${
            // Micro-interaction: slight movement on first hover
            isHovering && !hasHovered
              ? currentLanguage === "en" 
                ? "translate-x-2" 
                : "translate-x-[calc(100%-8px)]"
              : ""
          }`}
          style={{ left: "2px" }}
        />
        
        {/* Toggle labels */}
        <div className="relative flex pointer-events-none">
          <div
            className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 select-none ${
              currentLanguage === "en"
                ? "text-white"
                : "text-gray-600"
            }`}
          >
            <span className="hidden sm:inline">English</span>
            <span className="sm:hidden">EN</span>
          </div>
          
          <div
            className={`relative z-10 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 select-none ${
              currentLanguage === "es"
                ? "text-white"
                : "text-gray-600"
            }`}
          >
            <span className="hidden sm:inline">Español</span>
            <span className="sm:hidden">ES</span>
          </div>
        </div>
      </div>
    </button>
  );
}