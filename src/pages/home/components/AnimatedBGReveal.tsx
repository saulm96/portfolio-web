import React, { useState, useEffect, type ReactNode, useRef } from "react";
import {
  motion,
  useTransform,
  MotionValue,
  useAnimation,
  type Variants,
} from "framer-motion";

import "./AnimatedBGReveal.css";


interface AnimatedBGRevealProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  children?: ReactNode;
}



/**
 * AnimatedBGReveal is a React component that creates a
 * full-screen reveal animation of a background color, with
 * a corner-to-full-screen transition and a mouse-follow
 * effect. It also supports expanding the component to
 * full screen on user click.
 *
 * The component will first render in its full-screen state
 * (visually), then animate to its corner state. It will
 * then listen for mouse movement and expand to full screen
 * when the user moves the mouse.
 *
 * If the user clicks on the component while it is in its
 * corner state, it will expand to full screen and animate
 * the background color to the solid background color of the
 * content container.
 *
 * The component also supports a content container with its
 * own animation, which will be animated based on the expansion
 * state of the component.
 *
 * @prop {MotionValue<number>} mouseX - The mouse X position
 * @prop {MotionValue<number>} mouseY - The mouse Y position
 * @prop {ReactNode} children - The content to be rendered
 * inside the component
 */

const AnimatedBGReveal: React.FC<AnimatedBGRevealProps> = ({ mouseX, mouseY, children }) => {
  // Tracks if the initial entrance animation has finished
  const [isIntroAnimationComplete, setIsIntroAnimationComplete] = useState(false);
  // Tracks if the component is expanded to full screen
  const [isExpanded, setIsExpanded] = useState(false);
  // Tracks if the user has moved the mouse after the intro animation completed
  const [hasUserMovedMouseAfterIntro, setHasUserMovedMouseAfterIntro] = useState(false);
  const animationControls = useAnimation(); // Controls for imperative animations

  // Refs to store the mouse position when the interaction starts (post-intro)
  const initialMouseXOffsetRef = useRef<number>(0);
  const initialMouseYOffsetRef = useRef<number>(0);

  // Input range for mouse transformations, based on viewport size
  const inputSpanX = typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  const inputSpanY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  // Mouse values are active only if intro is done, panel is not expanded, AND user has moved mouse after intro
  const activeMouseX = useTransform(mouseX, currentMouseX => {
    if (isIntroAnimationComplete && !isExpanded && hasUserMovedMouseAfterIntro) {
      // Subtract the initial offset to make the movement relative
      return currentMouseX - initialMouseXOffsetRef.current;
    }
    return 0; // No mouse effect
  });

  const activeMouseY = useTransform(mouseY, currentMouseY => {
    if (isIntroAnimationComplete && !isExpanded && hasUserMovedMouseAfterIntro) {
      // Subtract the initial offset to make the movement relative
      return currentMouseY - initialMouseYOffsetRef.current;
    }
    return 0; // No mouse effect
  });

  // Transform active mouse coordinates into rotation and translation values
  const rotateY_eff = useTransform(activeMouseX, [-inputSpanX, inputSpanX], [-10, 10]);
  const rotateX_eff = useTransform(activeMouseY, [-inputSpanY, inputSpanY], [10, -10]);
  const translateX_eff = useTransform(activeMouseX, [-inputSpanX, inputSpanX], [-15, 15]);
  const translateY_eff = useTransform(activeMouseY, [-inputSpanY, inputSpanY], [-15, 15]);

  // Variants for the main reveal panel's animation
  const componentVariants: Variants = {
    fullScreen: { // Full viewport state
      position: 'absolute',
      top: 0, left: 0, width: '100vw', height: '100vh',
      borderRadius: '0px', boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0,
      backgroundColor: 'rgba(255, 255, 255, 1)', // Solid background for content
      transition: { type: 'spring', stiffness: 80, damping: 20 }
    },
    corner: { // Small state, positioned in the corner
      position: 'absolute',
      top: '25%', left: '65%', width: '20%', height: '65vh',
      borderRadius: '20px', boxShadow: '0px 15px 35px -10px rgba(0, 0, 0, 0.35)',
      opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0,
      backgroundColor: 'rgba(255, 255, 255, 1)', // Consistent background
      transition: { type: 'spring', stiffness: 80, damping: 20, delay: 0.5 } // Intro animation delay
    },
  };

  // Variants for the content visibility animation
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 1.5 } } // Content appears after panel expands
  };

  // Handles the initial animation sequence on mount
  useEffect(() => {
    const sequence = async () => {
      await animationControls.start("corner"); // Animate to corner state
      setIsIntroAnimationComplete(true);
    };
    sequence();
  }, [animationControls]);

  // Effect to detect the first mouse movement after the intro animation is complete
  useEffect(() => {
    let unsubscribeX: (() => void) | undefined;
    let unsubscribeY: (() => void) | undefined;

    // Setup listeners only if conditions are met: intro done, panel in corner, first move not yet detected
    if (isIntroAnimationComplete && !isExpanded && !hasUserMovedMouseAfterIntro) {
      const onFirstMouseMove = () => { // This callback doesn't use the 'latest' value, which is fine
        // Check conditions again upon event, in case state changed rapidly
        if (isIntroAnimationComplete && !isExpanded && !hasUserMovedMouseAfterIntro) {
          // Capture the current mouse positions as the initial offsets
          initialMouseXOffsetRef.current = mouseX.get();
          initialMouseYOffsetRef.current = mouseY.get();
          setHasUserMovedMouseAfterIntro(true); // Set flag that user has moved mouse
        }
      };

      // Use the new .on('change', callback) method instead of .onChange(callback)
      unsubscribeX = mouseX.on('change', onFirstMouseMove); // Updated listener attachment
      unsubscribeY = mouseY.on('change', onFirstMouseMove); // Updated listener attachment
    }

    return () => {
      // Cleanup: unsubscribe from listeners when effect re-runs or component unmounts
      // The .on() method also returns an unsubscribe function.
      if (unsubscribeX) unsubscribeX();
      if (unsubscribeY) unsubscribeY();
    };
  }, [isIntroAnimationComplete, isExpanded, hasUserMovedMouseAfterIntro, mouseX, mouseY]); // Dependencies ensure effect re-evaluates correctly


  // Handles click to expand the component to full screen
  const handleClick = async () => {
    // Expand only if intro is complete and panel is not already expanded
    if (isIntroAnimationComplete && !isExpanded) {
      setIsExpanded(true); // Set state to expanded
      await animationControls.start("fullScreen"); // Animate to fullScreen state
    }
    // Subsequent clicks do nothing if already expanded
  };

  return (
    <motion.div
      className="animated-bg-reveal" // Main animated panel
      variants={componentVariants}
      initial="fullScreen" // Start visually at fullScreen (before JS animation)
      animate={animationControls} // Link animations to controls
      onClick={handleClick}
      style={{
        x: translateX_eff, // Apply mouse-follow translation X
        y: translateY_eff, // Apply mouse-follow translation Y
        rotateX: rotateX_eff, // Apply mouse-follow rotation X
        rotateY: rotateY_eff, // Apply mouse-follow rotation Y
        cursor: (isIntroAnimationComplete && !isExpanded) ? 'pointer' : 'default', // Dynamic cursor hint
        display: 'flex', // Using flex to center content container by default
        justifyContent: 'center',
        alignItems: 'center',
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.7 }} // Transition for mouse-follow effect
    >
      {/* Inner container for the content, with its own animation */}
      <motion.div
        className="animated-bg-reveal-content"
        initial="hidden" // Start content as hidden
        animate={isExpanded ? "visible" : "hidden"} // Animate content based on panel expansion
        variants={contentVariants}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto', // Allow vertical scrolling for content if it overflows
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedBGReveal;