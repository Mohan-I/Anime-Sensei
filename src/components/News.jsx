import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

export const FeatureTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    gsap.to(itemRef.current, {
      rotationX: tiltX,
      rotationY: tiltY,
      scale: 0.98,
      transformPerspective: 700,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(itemRef.current, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <motion.div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const Card = ({ image, category, title, date, description, onClick }) => {
  return (
    <FeatureTilt className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer">
      <div 
        className="w-full h-64 bg-cover bg-center bg-no-repeat group relative"
        style={{ backgroundImage: `url(${image})` }}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <span className="text-xs font-semibold text-white bg-primary rounded-full px-3 py-1 self-start mb-2">
            {category}
          </span>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-white/80 mt-1">{date}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 line-clamp-2">{description}</p>
        <button 
          onClick={onClick}
          className="mt-4 text-primary hover:text-primary-dark font-medium text-sm transition-colors"
        >
          Read more →
        </button>
      </div>
    </FeatureTilt>
  );
};

const NewsModal = ({ news, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-96 w-full">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-primary bg-primary/10 rounded-full px-3 py-1">
              {news.category}
            </span>
            <span className="text-sm text-gray-500">{news.date}</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">{news.title}</h2>
          <div className="prose max-w-none">
            {news.fullContent || (
              <>
                <p className="text-lg text-gray-700 mb-4">{news.description}</p>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                </p>
                <p className="text-gray-600 mb-4">
                  Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
                </p>
                <p className="text-gray-600">
                  Proin at consectetur eros, sed aliquet ligula. Integer vitae facilisis libero. Cras auctor consectetur tempus. Vivamus interdum semper dolor, ac ultrices urna tincidunt at.
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const News = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const cardsContainerRef = useRef(null);

  const newsData = [
    {
      id: 1,
      image: "./img/blog1.webp",
      category: "WEB UPDATES",
      title: "2024-12-24 Patch Notes",
      date: "December 24, 2024",
      description: "3rd Anniversary Event Announcement",
      fullContent: (
        <>
          <p className="text-lg text-gray-700 mb-4">
            We're thrilled to announce our 3rd Anniversary Event! This special celebration will run from December 24th to January 7th.
          </p>
          <h3 className="text-xl font-bold mb-3 mt-6">Event Highlights</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Double XP and rewards for all activities</li>
            <li>Exclusive anniversary skins and items</li>
            <li>Special login bonuses every day</li>
            <li>Limited-time anniversary quests</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 mt-6">New Features</h3>
          <p className="mb-4">
            We've also added several quality-of-life improvements based on your feedback:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Improved inventory management system</li>
            <li>New social features for guilds</li>
            <li>Enhanced character customization options</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      image: "/img/blog2.webp",
      category: "ANNOUNCEMENTS",
      title: "Temporary Maintenance Announcement (Completed)",
      date: "December 12, 2024",
      description: "Integrating Meta Account Accessibility",
      fullContent: (
        <>
          <p className="text-lg text-gray-700 mb-4">
            The maintenance scheduled for December 12th has been successfully completed. We've now fully integrated Meta account accessibility across all platforms.
          </p>
          <h3 className="text-xl font-bold mb-3 mt-6">What's New</h3>
          <p className="mb-4">
            With this update, you can now:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Link your existing account to Meta for cross-platform access</li>
            <li>Use Meta credentials to log in on any device</li>
            <li>Enjoy enhanced security features</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 mt-6">Known Issues</h3>
          <p className="mb-4">
            We're aware of the following minor issues and are working on fixes:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Some users may experience delayed friend list loading</li>
            <li>Avatar display issues in certain menus</li>
          </ul>
        </>
      )
    },
    {
      id: 3,
      image: "/img/blog3.webp",
      category: "WEB UPDATES",
      title: "Patch Notes v3.02",
      date: "November 21, 2024",
      description: "Patch Note Update v3.02",
      fullContent: (
        <>
          <h3 className="text-xl font-bold mb-3">Version 3.02 Patch Notes</h3>
          <p className="text-lg text-gray-700 mb-4">
            This update brings significant improvements to game performance and several new features.
          </p>
          
          <h4 className="text-lg font-bold mb-2 mt-4">New Content</h4>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Added new winter-themed maps</li>
            <li>5 new character skins available in the shop</li>
            <li>New story chapter: "Frozen Legacy"</li>
          </ul>
          
          <h4 className="text-lg font-bold mb-2 mt-4">Balance Changes</h4>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Adjusted damage values for several weapons</li>
            <li>Improved matchmaking algorithms</li>
            <li>Reduced cooldown on support abilities</li>
          </ul>
          
          <h4 className="text-lg font-bold mb-2 mt-4">Bug Fixes</h4>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Fixed crash when opening inventory</li>
            <li>Resolved audio issues on certain maps</li>
            <li>Fixed progression tracking in daily quests</li>
          </ul>
        </>
      )
    },
    {
      id: 4,
      image: "/img/blog4.webp",
      category: "WEB UPDATES",
      title: "Bug Fixes and Improvements",
      date: "October 10, 2024",
      description: "Enhanced Graphics and Network stability with more exciting web features",
      fullContent: (
        <>
          <p className="text-lg text-gray-700 mb-4">
            Our latest update focuses on improving the overall user experience with significant performance enhancements.
          </p>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Graphics Improvements</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Upgraded rendering engine for better visuals</li>
            <li>Improved lighting and shadow effects</li>
            <li>New high-resolution textures for environments</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Network Stability</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Reduced latency in all regions</li>
            <li>Improved matchmaking stability</li>
            <li>Better handling of connection issues</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-3 mt-6">New Web Features</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Interactive character viewer</li>
            <li>Enhanced profile customization</li>
            <li>New community forums</li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      image: "/img/entrance2.webp",
      category: "ANNOUNCEMENTS",
      title: "New Web Features Launched",
      date: "September 15, 2024",
      description: "Added New Tools and Features",
      fullContent: (
        <>
          <p className="text-lg text-gray-700 mb-4">
            We're excited to introduce several new features to enhance your experience on our platform.
          </p>
          
          <h3 className="text-xl font-bold mb-3 mt-6">New Dashboard</h3>
          <p className="mb-4">
            Completely redesigned user dashboard with:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Personalized content recommendations</li>
            <li>Quick access to recent activities</li>
            <li>Improved navigation</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Enhanced Tools</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>New character builder with more options</li>
            <li>Improved search functionality</li>
            <li>Real-time stats tracking</li>
          </ul>
        </>
      )
    },
    {
      id: 6,
      image: "/img/Blog.webp",
      category: "EVENTS",
      title: "Sakura Festival 2025",
      date: "June 15, 2025",
      description: "Join this event for exclusive rewards!",
      fullContent: (
        <>
          <p className="text-lg text-gray-700 mb-4">
            Celebrate the beauty of spring with our annual Sakura Festival! Running from June 15th to June 30th.
          </p>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Event Features</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Special Sakura-themed maps and quests</li>
            <li>Exclusive cosmetic items and pets</li>
            <li>Limited-time mini-games</li>
            <li>Double rewards for all festival activities</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-3 mt-6">How to Participate</h3>
          <p className="mb-4">
            Simply log in during the event period to receive your Sakura Festival Starter Pack. Complete special quests to earn unique rewards.
          </p>
        </>
      )
    },
    {
      id: 7,
      image: "/img/about.webp",
      category: "GUIDES",
      title: "Beginner's Guide to Anime Sensei",
      date: "December 1, 2024",
      description: "Your journey starts here with helpful tips and tricks.",
      fullContent: (
        <>
          <p className="text-lg text-gray-700 mb-4">
            Welcome to Anime Sensei! This guide will help you get started on your adventure.
          </p>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Getting Started</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Complete the tutorial to learn basic controls</li>
            <li>Claim your beginner rewards from the mail</li>
            <li>Join a guild for community support</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Progression Tips</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Focus on main story quests initially</li>
            <li>Complete daily missions for extra rewards</li>
            <li>Upgrade your equipment regularly</li>
          </ul>
          
          <h3 className="text-xl font-bold mb-3 mt-6">Advanced Strategies</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Learn enemy patterns for efficient combat</li>
            <li>Experiment with different team compositions</li>
            <li>Participate in events for exclusive items</li>
          </ul>
        </>
      )
    }
  ];

  useEffect(() => {
    const filtered = newsData.filter((card) => {
      const isCategoryMatch = activeTab === "All" || card.category === activeTab;
      const isSearchMatch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isCategoryMatch && isSearchMatch;
    });
    setFilteredCards(filtered);

    // Animation for cards container
    gsap.from(cardsContainerRef.current, {
      opacity: 10,
      y: 20,
      duration: 0.5,
      delay: 0.2
    });
  }, [activeTab, searchQuery]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Animation for tab change
    gsap.from(".news-card", {
      opacity: 100,
      y: 20,
      stagger: 0.1,
      duration: 0.5
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div id="news" className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated with the newest features, events, and announcements from our team.
          </p> */}
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-3 border border-violet-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search news..."
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["All", "WEB UPDATES", "ANNOUNCEMENTS", "EVENTS", "GUIDES"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 font-general rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-violet-700 text-white' : 'bg-secondary text-black hover:text-white hover:bg-violet-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 100, y: 20 }}
                animate={{ opacity: 95, y: 0 }}
                exit={{ opacity: 100, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="news-card"
              >
                <Card
                  image={card.image}
                  category={card.category}
                  title={card.title}
                  date={card.date}
                  description={card.description}
                  onClick={() => setSelectedNews(card)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No news found matching your criteria</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* News Modal */}
      <AnimatePresence>
        {selectedNews && (
          <NewsModal 
            news={selectedNews} 
            onClose={() => setSelectedNews(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;