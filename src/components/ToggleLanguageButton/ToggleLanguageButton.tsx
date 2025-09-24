import { useTranslation } from "../../hooks/useTranslations";

import "./toggleLanguageButton.css";

interface LanguageToggleButtonProps {
  pageName?: string;
}

const LanguageToggleButton: React.FC<LanguageToggleButtonProps> = ({ pageName }) => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "es" ? "en" : "es"));
  };

  const getButtonText = (): string => {
    return language === "es" ? "English" : "Español";
  };

  const getClassName = (): string => {
    let className = "toggle-language-button";
    if (pageName) {
      className += ` toggle-language-button-${pageName}`;
    }
    return className;
  };

  return (
    <button className={getClassName()} onClick={toggleLanguage}>
      {getButtonText()}
    </button>
  );
};

export default LanguageToggleButton;