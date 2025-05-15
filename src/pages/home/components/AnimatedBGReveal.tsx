import React, { useState, useEffect } from 'react';
import { motion, useTransform, MotionValue, useAnimation, type Variants } from 'framer-motion';
import './AnimatedBGReveal.css'; // Contains the final absolute positioning and styles

interface AnimatedBGRevealProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const AnimatedBGReveal: React.FC<AnimatedBGRevealProps> = ({ mouseX, mouseY }) => {
  const [isIntroAnimationComplete, setIsIntroAnimationComplete] = useState(false);
  const animationControls = useAnimation();

  const inputSpanX = typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  const inputSpanY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  const activeMouseX = useTransform(mouseX, value => isIntroAnimationComplete ? value : 0);
  const activeMouseY = useTransform(mouseY, value => isIntroAnimationComplete ? value : 0);

  const rotateY_eff = useTransform(activeMouseX, [-inputSpanX, inputSpanX], [-10, 10]);
  const rotateX_eff = useTransform(activeMouseY, [-inputSpanY, inputSpanY], [10, -10]);
  const translateX_eff = useTransform(activeMouseX, [-inputSpanX, inputSpanX], [-15, 15]);
  const translateY_eff = useTransform(activeMouseY, [-inputSpanY, inputSpanY], [-15, 15]);

  useEffect(() => {
    const sequence = async () => {
      await animationControls.start("introToFinal");
      setIsIntroAnimationComplete(true);
    };
    sequence();
  }, [animationControls]);

  const componentVariants: Variants = {
    initial: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
      boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      opacity: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
    },
    introToFinal: {
      position: 'absolute', // Final position from CSS
      top: '25%',
      left: '65%',
      width: '20%',
      height: '65vh',
      borderRadius: '20px',
      boxShadow: '0px 15px 35px -10px rgba(0, 0, 0, 0.35)',
      opacity: 1,
      x: 0, 
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        delay: 1, // 1-second delay for the intro animation to start
      }
    },
  };

  return (
    <motion.div
      className="animated-bg-reveal"
      variants={componentVariants}
      initial="initial"
      animate={animationControls}
      style={{ // Mouse follow transforms are applied here
        x: translateX_eff,
        y: translateY_eff,
        rotateX: rotateX_eff,
        rotateY: rotateY_eff,
      }}
      // This transition applies to the mouse follow effect
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.7 }}
    />
  );
};

export default AnimatedBGReveal;