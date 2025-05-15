import { useTranslation } from "../../hooks/useTranslations";

import "./toggleLanguageButton.css";

const LanguageToggleButton: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "es" ? "en" : "es"));
  };

  const getButtonText = (): string => {
    return language === "es" ? "English" : "Español";
  };

  return (
    <button className="toggle-language-button" onClick={toggleLanguage}>
      {getButtonText()}
    </button>
  );
};


export default LanguageToggleButton;