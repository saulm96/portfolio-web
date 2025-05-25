import { useState, useRef, useEffect } from "react";
import styles from "./TypedAnimatedText.module.css";

interface TypedAnimatedTextProps {
  text: string;
  typingSpeed?: number;
  cursorBlinkSpeed?: number;
  className?: string;
  startDelay?: number;
}

/**
 * A React component that types out a given string of text, with a blinking
 * cursor, optional custom CSS class for the main span, and an optional start delay.
 *
 * @param {object} props
 * @prop {string} text The text to be typed out
 * @prop {number} [typingSpeed=100] Speed of typing in milliseconds per character
 * @prop {number} [cursorBlinkSpeed=500] Speed of cursor blinking in milliseconds
 * @prop {string} [className] Optional CSS class for the main span
 * @prop {number} [startDelay=2500] Delay in milliseconds before the animation starts
 */
const TypedAnimatedText: React.FC<TypedAnimatedTextProps> = ({
  text,
  typingSpeed = 100,
  cursorBlinkSpeed = 500,
  className,
  startDelay = 2500,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const textIndexRef = useRef(0);

  // Typing effect with optional start delay
  useEffect(() => {
    if (typeof text !== "string") {
      setDisplayedText("");
      textIndexRef.current = 0;
      setShowCursor(false);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    textIndexRef.current = 0;
    setIsTyping(false);

    if (text.length === 0) {
      setShowCursor(false);
      return;
    }

    let typingIntervalId: number | undefined;

    const delayTimeoutId = window.setTimeout(() => {
      setIsTyping(true);

      typingIntervalId = window.setInterval(() => {
        if (textIndexRef.current < text.length) {
          const charIndex = textIndexRef.current;
          setDisplayedText((prev) => prev + text[charIndex]);
          textIndexRef.current += 1;
        } else {
          if (typingIntervalId !== undefined) {
            clearInterval(typingIntervalId);
          }
          setIsTyping(false);
        }
      }, typingSpeed);
    }, startDelay);

    return () => {
      window.clearTimeout(delayTimeoutId);
      if (typingIntervalId !== undefined) {
        window.clearInterval(typingIntervalId);
      }
    };
  }, [text, typingSpeed, startDelay]);

  // Cursor blinking effect
  useEffect(() => {
    if (typeof text !== "string" || text.length === 0) {
      setShowCursor(false);
      return;
    }

    let cursorBlinkingInterval: number | undefined = undefined;

    if (isTyping) {
      setShowCursor(true);
    } else {
      setShowCursor(true);
      cursorBlinkingInterval = window.setInterval(() => {
        setShowCursor((prev) => !prev);
      }, cursorBlinkSpeed);
    }

    return () => {
      if (cursorBlinkingInterval !== undefined) {
        window.clearInterval(cursorBlinkingInterval);
      }
    };
  }, [isTyping, text, cursorBlinkSpeed]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span
          className={`${styles.cursor} ${
            !isTyping && text.length > 0
              ? styles.cursorFinishedBlinking
              : styles.cursorTypingStatic
          }`}
        >
          |
        </span>
      )}
    </span>
  );
};

export default TypedAnimatedText;
