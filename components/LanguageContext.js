"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import translations from "@/lib/i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("EN");

  useEffect(() => {
    const stored = localStorage.getItem("lpg_lang");
    if (stored && translations[stored]) setLang(stored);
  }, []);

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem("lpg_lang", code);
    document.documentElement.lang = code.toLowerCase();
  };

  const t = translations[lang] || translations.EN;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
