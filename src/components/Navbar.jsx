import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';
import { Link, NavLink } from 'react-router-dom'; // Import Link from react-router-dom for navigation

const navItems = ['News', 'Guide', 'Community', 'About', 'Contact'];

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility
  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove('floating-nav');
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add('floating-nav');
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add('floating-nav');
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  const toggleAudioIndicator = () => {
    if (isAudioPlaying) {
      audioElementRef.current.pause();
      setIsAudioPlaying(false);
      setIsIndicatorActive(false);
    } else {
      audioElementRef.current.play();
      setIsAudioPlaying(true);
      setIsIndicatorActive(true);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle mobile menu visibility

  return (
    <div ref={navContainerRef} className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6">
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo & Button */}
          <div className="flex items-center gap-8">
            <NavLink to="/">
              <img src="/img/logo.png" alt="logo" className="w-10" />
            </NavLink>
            <NavLink to="/anime">
              <Button
                id="watch-button"
                title="watch anime"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 flex items-center justify-center gap-2"
              />
            </NavLink>
          </div>

          {/* Mobile Hamburger Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-3xl border-none text-blue-50">
              ☰ {/* Hamburger icon */}
            </button>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex h-full items-start p-2">
            {navItems.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="nav-hover-btn"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Audio Indicator */}
          <button className="ml-10 flex items-center space-x-0.5" onClick={toggleAudioIndicator}>
            <audio ref={audioElementRef} className="hidden" src="./audio/song.mp3" loop />
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`indicator-line ${isIndicatorActive ? 'active' : ''}`}
                style={{ animationDelay: `${bar * 0.1}s` }}
              />
            ))}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Menu - Toggled */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white p-4 shadow-lg">
          <div className="flex flex-col items-center">
            {navItems.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="py-2 px-4 hover:bg-gray-200"
                onClick={toggleMenu} // Close the menu on item click
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
