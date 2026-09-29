import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Get the current route's pathname

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on route change
  }, [pathname]); // Re-run the effect when `pathname` changes

  return null; // No UI rendered by this component
};

export default ScrollToTop;
