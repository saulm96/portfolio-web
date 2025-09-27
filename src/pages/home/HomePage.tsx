import { useTranslation } from "../../hooks/useTranslations";

import { useEffect, useState } from "react";
import { useMotionValue } from "framer-motion";

import AnimatedBGReveal from "./components/AnimatedBGReveal";
import TypedAnimatedText from "../../components/TypingAnimatedText/TypedAnimatedText";
import ToggleLanguage from "../../components/ToggleLanguageButton/ToggleLanguageButton";
import HomeNavigator from "./components/HomeNavigator";
import backgroundVideo from "../../assets/videos/portfolio-welcome-bg.mp4"

import "./HomePage.css";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [hasBgExpanded, setHasBgExpanded] = useState(false);
  const [isNavigatorEnabled, setIsNavigatorEnabled] = useState(false);
  const [shouldRenderVideo, setShouldRenderVideo] = useState(true);
  // Motion values to store mouse coordinates, relative to viewport center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMoveWindow = (event: MouseEvent) => {
      const xRelativeToCenter = event.clientX - window.innerWidth / 2;
      const yRelativeToCenter = event.clientY - window.innerHeight / 2;

      mouseX.set(xRelativeToCenter);
      mouseY.set(yRelativeToCenter);
    };

    if (!hasBgExpanded)
      window.addEventListener("mousemove", handleMouseMoveWindow);
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWindow);
    };
  }, [mouseX, mouseY, hasBgExpanded]);

  const handleBgExpanded = () => {
    setHasBgExpanded(true);
    // Enable navigator after expansion animation completes
    setTimeout(() => {
      setIsNavigatorEnabled(true);
    }, 2000);
  };

  return (
    <>
    <ToggleLanguage pageName="home"/>
    {shouldRenderVideo && (
      <video 
        autoPlay 
        loop 
        muted 
        className="home-welcome-bg"
        style={{ 
          filter: 'brightness(0.5) contrast(1.1)',
          opacity: hasBgExpanded ? 0 : 1,
          transition: 'opacity 2s ease-out',
          pointerEvents: 'none'
        }}
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement;
          video.playbackRate = 0.5;
        }}
        onTransitionEnd={() => {
          if (hasBgExpanded) {
            setShouldRenderVideo(false);
          }
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
    )}
    <div className="home-welcome-bg-overlay"></div>
      <div className="home-page-content-wraper">
        <div className="typed-animation-text-wrapper">
          {!hasBgExpanded && (
            <TypedAnimatedText
              text={t("lp_typing_animation_text")}
              className="home-page-typed-text"
            />
          )}
        </div>

        <AnimatedBGReveal
          mouseX={mouseX}
          mouseY={mouseY}
          onExpanded={handleBgExpanded}
        >
          <div className="home-page-expanded-content">
            <p className="home-page-welcome-text">{t("welcome_text")}</p>
            <HomeNavigator isEnabled={isNavigatorEnabled} />
          </div>
        </AnimatedBGReveal>
      </div>
    </>
  );
};

export default HomePage;
