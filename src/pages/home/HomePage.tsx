import { useTranslation } from "../../hooks/useTranslations";

import { useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";

import AnimatedBGReveal from "./components/AnimatedBGReveal";
import TypedAnimatedText from "../../components/TypingAnimatedText/TypedAnimatedText";

import "./HomePage.css";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [hasBgExpanded, setHasBgExpanded] = useState(false);
  //Motion values to store mouse coordinates, relative to viewport center.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMoveWindow = (event: MouseEvent) => {
      const xRelativeToCenter = event.clientX - window.innerWidth / 2;
      const yRelativeToCenter = event.clientY - window.innerHeight / 2;

      mouseX.set(xRelativeToCenter);
      mouseY.set(yRelativeToCenter);
    };

    if(!hasBgExpanded) window.addEventListener("mousemove", handleMouseMoveWindow);
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWindow);
    };
  }, [mouseX, mouseY, hasBgExpanded]); 

  const handleBgExpanded = () => setHasBgExpanded(true);

  return (
    <div className="home-page-content-wraper">
      {!hasBgExpanded && (
        <TypedAnimatedText
          text={t("lp_typing_animation_text")}
          className="home-page-typed-text"
        />
      )}

      <AnimatedBGReveal
        mouseX={mouseX}
        mouseY={mouseY}
        onExpanded={handleBgExpanded} 
      >
        <p className="home-page-welcome-text">{t("welcome_text")}</p>
      </AnimatedBGReveal>
    </div>
  );
};

export default HomePage;
