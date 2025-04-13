import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Listen for focus events on input elements
  useEffect(() => {
    const handleFocus = () => {
      setIsInputFocused(true);
      setShouldAutoScroll(false);
      
      // Remember we have keyboard open for a period of time
      setTimeout(() => {
        if (!isInputFocused) {
          setShouldAutoScroll(true);
        }
      }, 10000);
    };

    const handleBlur = () => {
      // Delay resetting focus state to prevent premature scrolling
      setTimeout(() => {
        setIsInputFocused(false);
        setShouldAutoScroll(true);
      }, 300);
    };

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, [isInputFocused]);

  // Check if user has manually scrolled up
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 50;
      
      if (isScrolledUp && !isInputFocused) {
        setShouldAutoScroll(false);
      } else if (!isScrolledUp) {
        setShouldAutoScroll(true);
      }
      
      setLastScrollHeight(scrollHeight);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isInputFocused]);

  // Handle mutations
  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        // Only auto-scroll if:
        // 1. Input is not focused (keyboard not visible)
        // 2. We should auto-scroll (user hasn't manually scrolled up)
        // 3. Window height is reasonable (not extremely small from keyboard)
        if (shouldAutoScroll && !isInputFocused && window.innerHeight > 400) {
          end.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, [shouldAutoScroll, isInputFocused]);

  return [containerRef, endRef];
}
