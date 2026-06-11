import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SCROLL_THRESHOLD = 250;
const BOTTOM_THRESHOLD = 100;

const ScrollNavigator = () => {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Show up button if user scrolled past threshold
    setShowUp(scrollY > SCROLL_THRESHOLD);

    // Show down button if page is scrollable and user is not near the bottom
    const isScrollable = scrollHeight - clientHeight > 50;
    const nearBottom = scrollHeight - scrollY - clientHeight < BOTTOM_THRESHOLD;
    setShowDown(isScrollable && !nearBottom);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Handle dynamic loading of content by recalculating after a short delay
    const timer = setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Recalculate scroll navigation when location/route changes
  useEffect(() => {
    handleScroll();
  }, [location, handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="scroll-navigator" aria-label="Scroll navigation">
      <button
        className={`scroll-navigator__btn scroll-navigator__btn--up ${!showUp ? "scroll-navigator__btn--hidden" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        disabled={!showUp}
      >
        <FaArrowUp aria-hidden="true" />
      </button>
      <button
        className={`scroll-navigator__btn scroll-navigator__btn--down ${!showDown ? "scroll-navigator__btn--hidden" : ""}`}
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
        disabled={!showDown}
      >
        <FaArrowDown aria-hidden="true" />
      </button>
    </div>
  );
};

export default ScrollNavigator;
