import { motion, useTransform, MotionValue } from 'framer-motion';

import "./AnimatedBGReveal.css";

interface AnimatedBGRevealProps {
  mouseX: MotionValue<number>; // MotionValue for mouse X coordinate (from parent)
  mouseY: MotionValue<number>; // MotionValue for mouse Y coordinate (from parent)
}

/**
 * AnimatedBGReveal component. This component takes two MotionValue objects from the parent,
 * mouseX and mouseY, representing the mouse position relative to the viewport center.
 * It then maps these values to rotation and translation values, and applies them to its
 * own style. The component is meant to be used as a direct child of the AnimatedBG
 * component, and will reveal a background image when the mouse is moved near the
 * component.
 *
 * @prop {MotionValue<number>} mouseX - Mouse position relative to viewport center on X axis.
 * @prop {MotionValue<number>} mouseY - Mouse position relative to viewport center on Y axis.
 * @return {React.ReactElement} - A styled div with motion properties.
 */
const AnimatedBGReveal: React.FC<AnimatedBGRevealProps> = ({ mouseX, mouseY }) => {
  // Input range for transformations, based on viewport dimensions.
  // Assumes mouseX/mouseY from parent are relative to viewport center.
  const inputSpanX = typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  const inputSpanY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  // Map mouse positions to rotation and translation values.
  const rotateY = useTransform(mouseX, [-inputSpanX, inputSpanX], [-10, 10]); // Max ±10deg rotation
  const rotateX = useTransform(mouseY, [-inputSpanY, inputSpanY], [10, -10]);  // Max ±10deg rotation

  const translateX = useTransform(mouseX, [-inputSpanX, inputSpanX], [-15, 15]); // Max ±15px translation
  const translateY = useTransform(mouseY, [-inputSpanY, inputSpanY], [-15, 15]); // Max ±15px translation

  return (
    <motion.div
      className="animated-bg-reveal"
      style={{
        x: translateX,
        y: translateY,
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.7 }}
    />
  );
};

export default AnimatedBGReveal;