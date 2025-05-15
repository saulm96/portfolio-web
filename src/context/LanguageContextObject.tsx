import React, { useState, useEffect, type ReactNode } from "react";
import { LanguageContext } from "./LanguageContext";

import esTranslations from "../locales/es.json";
import enTranslations from "../locales/en.json";

interface LanguageContextValue {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translations: Translation;
}

const defaultLanguage = "es";




export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState<Translation>(esTranslations);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        let selectedTranslations: Translation;
        switch (language) {
          case "en":
            selectedTranslations = enTranslations;
            break;
          default:
            selectedTranslations = esTranslations;
            break;
        }
        setTranslations(selectedTranslations);
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations(esTranslations);
      }
    };

    loadTranslations();
  }, [language]);

  const contextValue: LanguageContextValue = {
    language,
    setLanguage,
    translations,
  };
    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

