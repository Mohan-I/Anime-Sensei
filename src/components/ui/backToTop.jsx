import { useState, useEffect } from 'react'
import { TiArrowUpOutline } from 'react-icons/ti'

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls 100px from the top
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Add event listener for scrolling
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 bg-[#5542ff] text-white p-4 rounded-full shadow-lg transition-all duration-300 transform ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } hover:bg-blue-700 focus:outline-none`}
      aria-label="Back to top"
    >
        <TiArrowUpOutline />
    </button>
  );
};

export default BackToTopButton
