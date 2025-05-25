import { useState, useEffect, type ReactNode } from "react";
import { LanguageContext } from "./LanguageContext";

interface Translation {
  [key: string]: string;
}

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
  const [translations, setTranslations] = useState<Translation>({});

  useEffect(() => {
    const loadTranslations = () => {
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

        if (typeof selectedTranslations === 'object' && selectedTranslations !== null) {
            setTranslations(selectedTranslations);
        } else {
            console.error("Loaded translations are not a valid object:", selectedTranslations);
            setTranslations({});
        }
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations({});
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
