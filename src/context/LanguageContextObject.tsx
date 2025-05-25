import { useState, useEffect, type ReactNode } from "react";
import { LanguageContext } from "./LanguageContext";

// Definición de la interfaz Translation
// Asegúrate de que esta interfaz esté correctamente definida en tu proyecto
// O si es un tipo global, que esté accesible.
// Para este ejemplo, lo defino aquí temporalmente.
interface Translation {
  [key: string]: string;
}

import esTranslations from "../locales/es.json";
import enTranslations from "../locales/en.json";

interface LanguageContextValue {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translations: Translation;
  // isLoading: boolean; // Considera añadir esto si las traducciones se cargaran de forma asíncrona
}

const defaultLanguage = "es";

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(defaultLanguage);
  // Inicializamos translations con un objeto vacío o con las traducciones por defecto.
  // Es importante que sea un objeto para evitar que `translations.some_key` sea un error.
  const [translations, setTranslations] = useState<Translation>({});

  useEffect(() => {
    const loadTranslations = () => { // Ya no es async porque los imports son síncronos
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
        // Asegúrate de que selectedTranslations sea un objeto válido antes de establecerlo
        if (typeof selectedTranslations === 'object' && selectedTranslations !== null) {
            setTranslations(selectedTranslations);
        } else {
            console.error("Loaded translations are not a valid object:", selectedTranslations);
            setTranslations({}); // Fallback a un objeto vacío
        }
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations({}); // Fallback a un objeto vacío en caso de error
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