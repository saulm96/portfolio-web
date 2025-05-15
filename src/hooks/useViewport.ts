// src/hooks/useViewport.ts
import { useState, useEffect } from "react";
function simpleDebounce(func: () => void, waitFor: number): () => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func();
    }, waitFor);
  };
}

const useViewport = (breakpoint: number = 768) => {
  const getInitialIsMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }

    return false;
  };

  const [isMobile, setIsMobile] = useState<boolean>(getInitialIsMobile());

  useEffect(() => {
    const handleResize = () => {
      // Solo actualizamos si estamos en el navegador
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < breakpoint);
      }
    };

    if (typeof window !== "undefined") {
      handleResize();
    }

    const debouncedHandleResize = simpleDebounce(handleResize, 200);

    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedHandleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", debouncedHandleResize);
      }
    };
  }, [breakpoint]);

  return { isMobile };
};

export default useViewport;
