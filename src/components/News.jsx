import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import PageHero from "./ui/PageHero";

export const FeatureTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

// Reusable Card component
const Card = ({ image, category, title, date, description }) => {
  return (
    <FeatureTilt className="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
      <div
        className="w-full h-64 bg-black bg-cover bg-center bg-no-repeat group rounded-t-lg"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="py-24 hover:backdrop-blur-sm bg-black/30 h-64 rounded-t-lg text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <p className="text-sm font-general mx-4 border hover:bg-white hover:text-black rounded-full px-4 my-2 w-fit">
            {category}
          </p>
          <h3 className="text-lg mx-4 font-robert-medium">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-robert-medium mb-2">
          <span className="mr-2">📅</span>
          {date}
        </p>
        <h3 className="text-sm font-robert-medium">{description}</h3>
      </div>
    </FeatureTilt>
  );
};

const News = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const cardRefs = useRef([]);

  const cards = [
    {
      id: 1,
      image: "./img/blog1.webp",
      category: "WEB UPDATES",
      title: "2024-12-24 Patch Notes",
      date: "2024-12-24",
      description: "3rd Anniversary Event Announcement",
    },
    {
      id: 2,
      image: "/img/blog2.webp",
      category: "ANNOUNCEMENTS",
      title: "Temporary Maintenance Announcement (Completed)",
      date: "2024-12-12",
      description: "Integrating Meta Account Accessibility",
    },
    {
      id: 3,
      image: "/img/blog3.webp",
      category: "WEB UPDATES",
      title: "Patch Notes",
      date: "2024-11-21",
      description: "Patch Note Update v3.02",
    },
    {
      id: 4,
      image: "/img/blog4.webp",
      category: "WEB UPDATES",
      title: "Bug Fixes and Improvements",
      date: "2024-10-10",
      description: "Enhanced Graphics and Network stability with more exciting web features",
    },
    {
      id: 5,
      image: "/img/entrance2.webp",
      category: "ANNOUNCEMENTS",
      title: "New web Features Launched",
      date: "2024-09-15",
      description: "Added New Tools and Features",
    },
    {
      id: 6,
      image: "/img/Blog.webp",
      category: "EVENTS",
      title: "Sakura Festival 2025",
      date: "2025-06-15",
      description: "Join this event for exclusive rewards!",
    },
    {
      id: 7,
      image: "/img/about.webp",
      category: "GUIDES",
      title: "Beginner's Guide to Anime Sensei",
      date: "2024-12-01",
      description: "Your journey starts here with helpful tips and tricks.",
    },
  ];

  useEffect(() => {
    const filtered = cards.filter((card) => {
      const isCategoryMatch =
        activeTab === "All" || card.category === activeTab;
      const isSearchMatch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isCategoryMatch && isSearchMatch;
    });
    setFilteredCards(filtered);
  }, [activeTab, searchQuery]);

  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    cardRefs.current.forEach((cardRef, index) => {
      gsap.fromTo(
        cardRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
      );
    });
  }, [filteredCards]);

  return (
    <div id="news" className="min-h-screen w-full">

      {/* Filter Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 py-4 px-4 bg-gray-100">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-2/3 lg:w-1/2 py-2 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Search..."
        />
        <select
          value={activeTab}
          onChange={handleTabChange}
          className="w-full md:w-auto py-2 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-800 text-white"
        >
          <option value="All">All</option>
          <option value="WEB UPDATES">WEB UPDATES</option>
          <option value="ANNOUNCEMENTS">ANNOUNCEMENTS</option>
        </select>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredCards.map((card, index) => (
          <Card
            key={card.id}
            image={card.image}
            category={card.category}
            title={card.title}
            date={card.date}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default News;
