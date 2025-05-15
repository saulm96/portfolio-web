import { useTranslation } from "../../hooks/useTranslations";

const StackPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t("app_title")}</h1>
            <p>{t("welcome_text")}</p>
        </div>
    );
}

export default StackPage;