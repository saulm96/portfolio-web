// TypedAnimatedText.tsx
import { useState, useRef, useEffect } from "react";
import styles from "./TypedAnimatedText.module.css"; // Make sure this path is correct

interface TypedAnimatedTextProps {
  text: string; // The text to be typed out
  typingSpeed?: number; // Speed of typing in milliseconds per character
  cursorBlinkSpeed?: number; // Speed of cursor blinking in milliseconds
  className?: string; // Optional CSS class for the main span
  startDelay?: number; // Optional delay in milliseconds before the animation starts
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
 * @prop {number} [startDelay=0] Delay in milliseconds before the animation starts
 */
const TypedAnimatedText: React.FC<TypedAnimatedTextProps> = ({
  text,
  typingSpeed = 100,
  cursorBlinkSpeed = 500,
  className,
  startDelay = 2500, // Default value for startDelay
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const textIndexRef = useRef(0);

  // Effect responsible for the typing animation with an optional delay
  useEffect(() => {
    // Validate the 'text' prop
    if (typeof text !== "string") {
      setDisplayedText("");
      textIndexRef.current = 0;
      setShowCursor(false);
      setIsTyping(false);
      return;
    }

    // Reset state for new text or on mount
    setDisplayedText("");
    textIndexRef.current = 0;
    setIsTyping(false); // Ensure isTyping is false before the delay and typing

    // Handle the case of an empty string
    if (text.length === 0) {
      setShowCursor(false);
      // isTyping is already false
      return;
    }

    // If text is valid and non-empty, set up the delay
    let typingIntervalId: number | undefined;
    
    const delayTimeoutId = window.setTimeout(() => {
      setIsTyping(true); // Typing starts AFTER the delay

      typingIntervalId = window.setInterval(() => {
        if (textIndexRef.current < text.length) {
          const charIndex = textIndexRef.current;
          setDisplayedText((prev) => prev + text[charIndex]);
          textIndexRef.current += 1;
        } else {
          if (typingIntervalId !== undefined) {
            clearInterval(typingIntervalId);
          }
          setIsTyping(false); // Typing has finished
        }
      }, typingSpeed);
    }, startDelay); // Use the new prop here

    // Cleanup function for this effect
    return () => {
      window.clearTimeout(delayTimeoutId); // Clear the delay timeout
      if (typingIntervalId !== undefined) {
        window.clearInterval(typingIntervalId); // Clear the typing interval if it exists
      }
    };
  }, [text, typingSpeed, startDelay]); // Add startDelay to dependencies

  // useEffect for cursor visibility and blinking behavior
  useEffect(() => {
    if (typeof text !== "string" || text.length === 0) { // Rule 1: No text, no cursor
      setShowCursor(false);
      return;
    }

    let cursorBlinkingInterval: number | undefined = undefined;

    if (isTyping) { // Rule 2: While typing, cursor is static and visible
      setShowCursor(true);
      // NO blinking interval is started here
    } else { // Rule 3: When NOT typing (initial delay, or finished), cursor blinks
      setShowCursor(true); // Make sure it's visible before first blink
      cursorBlinkingInterval = window.setInterval(() => {
        setShowCursor((prev) => !prev);
      }, cursorBlinkSpeed);
    }

    return () => { // Cleanup
      if (cursorBlinkingInterval !== undefined) {
        window.clearInterval(cursorBlinkingInterval);
      }
    };
  }, [isTyping, text, cursorBlinkSpeed]); // Existing dependencies

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span
          className={`${styles.cursor} ${
            !isTyping && text.length > 0 ? styles.cursorFinishedBlinking : styles.cursorTypingStatic
          }`}
        >
          |
        </span>
      )}
    </span>
  );
};

export default TypedAnimatedText;