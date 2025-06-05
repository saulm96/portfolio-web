import { useState, useEffect, type ReactNode, useRef } from "react";
import {
  motion,
  useTransform,
  MotionValue,
  useAnimation,
  type Variants,
} from "framer-motion";

import { GalaxyScene } from "../../../components/experiences/GalacyScene"; 

import "./AnimatedBGReveal.css";

interface AnimatedBGRevealProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  children?: ReactNode;
  onExpanded?: () => void;
}

const galaxyFadeVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
};

/**
 * AnimatedBGReveal is a React functional component that provides an animated
 * background reveal effect. It utilizes framer-motion for smooth animations
 * and reacts to mouse movements to create a parallax effect.
 *
 * @param {object} props - The component props
 * @param {MotionValue<number>} props.mouseX - Motion value representing the X-coordinate of the mouse
 * @param {MotionValue<number>} props.mouseY - Motion value representing the Y-coordinate of the mouse
 * @param {ReactNode} [props.children] - Optional children to be rendered inside the component
 *
 * The component transitions between "fullScreen" and "corner" states based on
 * user interactions, with an introductory animation sequence. It also includes
 * a galaxy scene background that becomes visible after the intro animation.
 */

const AnimatedBGReveal: React.FC<AnimatedBGRevealProps> = ({
  mouseX,
  mouseY,
  children,
  onExpanded,
}) => {
  const [isIntroAnimationComplete, setIsIntroAnimationComplete] =
    useState(false);
  const [isGalaxyVisible, setIsGalaxyVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUserMovedMouseAfterIntro, setHasUserMovedMouseAfterIntro] =
    useState(false);
  const animationControls = useAnimation();
  const initialMouseXOffsetRef = useRef<number>(0);
  const initialMouseYOffsetRef = useRef<number>(0);

  const inputSpanX = typeof window !== "undefined" ? window.innerWidth / 2 : 600;
  const inputSpanY = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

  const activeMouseX = useTransform(mouseX, (currentMouseX) => {
    if (isIntroAnimationComplete && !isExpanded && hasUserMovedMouseAfterIntro) {
      return currentMouseX - initialMouseXOffsetRef.current;
    }
    return 0;
  });

  const activeMouseY = useTransform(mouseY, (currentMouseY) => {
    if (isIntroAnimationComplete && !isExpanded && hasUserMovedMouseAfterIntro) {
      return currentMouseY - initialMouseYOffsetRef.current;
    }
    return 0;
  });

  const rotateY_eff = useTransform(activeMouseX, [-inputSpanX, inputSpanX], [-10, 10]);
  const rotateX_eff = useTransform(activeMouseY, [-inputSpanY, inputSpanY], [10, -10]);
  const translateX_eff = useTransform(activeMouseX, [-inputSpanX, inputSpanX], [-15, 15]);
  const translateY_eff = useTransform(activeMouseY, [-inputSpanY, inputSpanY], [-15, 15]);

  const STAR_PARALLAX_RANGE = 1.5;
  const starParallaxX = useTransform(
    activeMouseX,
    [-inputSpanX, inputSpanX],
    [-STAR_PARALLAX_RANGE, STAR_PARALLAX_RANGE]
  );
  const starParallaxY = useTransform(
    activeMouseY,
    [-inputSpanY, inputSpanY],
    [-STAR_PARALLAX_RANGE, STAR_PARALLAX_RANGE]
  );

  const componentVariants: Variants = {
    fullScreen: { position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: "0px", boxShadow: "0px 0px 0px rgba(0,0,0,0)", opacity: 1, backgroundColor: "rgb(0, 0, 0)", transition: { type: "spring", stiffness: 80, damping: 20 }, },
    corner: { position: "absolute", top: "25%", left: "65%", width: "20%", height: "65vh", borderRadius: "20px", boxShadow: "0px 15px 35px -10px rgba(0, 0, 0, 0.35)", opacity: 1, backgroundColor: "rgb(0, 0, 0)", transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.5 }, },
  };
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 1.5 } },
  };

  useEffect(() => {
    const sequence = async () => {
      await animationControls.start("corner");
      setIsIntroAnimationComplete(true);
      setIsGalaxyVisible(true);
    };
    sequence();
  }, [animationControls]);

  useEffect(() => {
    let unsubscribeX: (() => void) | undefined, unsubscribeY: (() => void) | undefined;
    if (isIntroAnimationComplete && !isExpanded && !hasUserMovedMouseAfterIntro) {
      const onFirstMouseMove = () => {
        if (isIntroAnimationComplete && !isExpanded && !hasUserMovedMouseAfterIntro) {
          initialMouseXOffsetRef.current = mouseX.get(); initialMouseYOffsetRef.current = mouseY.get(); setHasUserMovedMouseAfterIntro(true);
        }
      };
      unsubscribeX = mouseX.on("change", onFirstMouseMove); unsubscribeY = mouseY.on("change", onFirstMouseMove);
    }
    return () => { if (unsubscribeX) unsubscribeX(); if (unsubscribeY) unsubscribeY(); };
  }, [isIntroAnimationComplete, isExpanded, hasUserMovedMouseAfterIntro, mouseX, mouseY]);

  const handleClick = async () => {
    if (isIntroAnimationComplete && !isExpanded) {
      setIsGalaxyVisible(false);     
      setIsExpanded(true);

      await animationControls.start("fullScreen"); 

      if (onExpanded) onExpanded();
    }
  };

  const motionDivStyle = {
    x: translateX_eff, y: translateY_eff, rotateX: rotateX_eff, rotateY: rotateY_eff,
    cursor: (isIntroAnimationComplete && !isExpanded ? "pointer" : "default"),
    display: "flex" as const, justifyContent: "center" as const, alignItems: "center" as const,
    position: "relative" as const, overflow: "hidden" as const,

    ...(isIntroAnimationComplete && !isExpanded && { backgroundColor: "transparent" }),

    ...(isExpanded && { backgroundColor: "rgb(0,0,0)"})
  };

  return (
    <motion.div
      className="animated-bg-reveal"
      variants={componentVariants}
      initial="fullScreen"
      animate={animationControls}
      onClick={handleClick}
      style={motionDivStyle}
      transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.7 }}
    >
      {isIntroAnimationComplete && (
        <motion.div
          style={{ position: "absolute" as const, top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
          variants={galaxyFadeVariants}
          initial="hidden"
          animate={isGalaxyVisible ? "visible" : "hidden"}
        >
          <GalaxyScene starParallaxX={starParallaxX} starParallaxY={starParallaxY} />
        </motion.div>
      )}
      <motion.div
        className="animated-bg-reveal-content"
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        variants={contentVariants}
        style={{ width: "100%", height: "100%", overflowY: "auto", position: "relative" as const, zIndex: 1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedBGReveal;