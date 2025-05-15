import { useContext } from "react";
import {LanguageContext} from "../context/LanguageContext";

interface LanguageContextValue {
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    translations: {[key: string]: string};
}

export const useTranslation = () => {
    const context = useContext(LanguageContext) as LanguageContextValue;
    const {translations} = context;

    const t = (key: string): string => {
        return translations[key] || key;
    };
    return{ t, language: context.language, setLanguage: context.setLanguage};
}