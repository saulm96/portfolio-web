import { useTranslation } from "../../hooks/useTranslations";

import AnimatedBGReveal from "./components/AnimatedBGReveal";

import "./HomePage.css";

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="home-page-content-wraper">
            <h1 className="home-page-title">{t("app_title")}</h1>
            <p className="home-page-welcome-text">{t("welcome_text")}</p>
            <AnimatedBGReveal />
        </div>
    );
}

export default HomePage;