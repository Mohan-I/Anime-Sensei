import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TiLocationArrow, TiInfoLarge, TiTimes } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";

const GuideSection = () => {
  const headerRef = useRef(null);
  const featuresRef = useRef([]);
  const buttonRef = useRef(null);
  const [activeGuideline, setActiveGuideline] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // GSAP animations for header, features, and button
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    featuresRef.current.forEach((feature, index) => {
      gsap.fromTo(
        feature,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, delay: index * 0.2, duration: 0.8, ease: "power2.out" }
      );
    });

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, delay: 1.5, duration: 0.6, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  const guidelines = [
    {
      title: "Respectful Language",
      content: "Always use respectful and inclusive language when interacting with others on the platform. Avoid offensive terms and be mindful of cultural differences.",
      icon: "💬"
    },
    {
      title: "Legal Content",
      content: "Do not share or promote illegal content, including pirated anime or unauthorized streams. Respect copyright laws and intellectual property rights.",
      icon: "⚖️"
    },
    {
      title: "Account Security",
      content: "Ensure your account details are secure by using strong passwords and enabling two-factor authentication. Never share your login credentials with others.",
      icon: "🔒"
    },
    {
      title: "Community Guidelines",
      content: "Follow community guidelines when posting in forums. Be constructive in discussions and report any inappropriate behavior to moderators.",
      icon: "👥"
    },
    {
      title: "Technical Support",
      content: "Contact support for any technical or account-related issues. Our team is available 24/7 to assist you with any problems you encounter.",
      icon: "🛠️"
    }
  ];

  return (
    <div className="relative">
      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed lg:hidden bottom-6 right-6 z-30 p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors"
      >
        <TiInfoLarge className="text-2xl" />
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block h-fit sticky top-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md lg:w-1/4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-2">
            <TiInfoLarge className="text-teal-500" />
            Website Guidelines
          </h3>
          <ul className="space-y-4">
            {guidelines.map((guideline, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                onClick={() => setActiveGuideline(guideline)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{guideline.icon}</span>
                  <div>
                    <h4 className="font-semibold dark:text-white">{guideline.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {guideline.content}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </aside>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed lg:hidden inset-y-0 right-0 z-40 w-4/5 max-w-sm p-6 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <TiInfoLarge className="text-teal-500" />
                  Guidelines
                </h3>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <TiTimes className="text-xl" />
                </button>
              </div>
              <ul className="space-y-4">
                {guidelines.map((guideline, index) => (
                  <motion.li
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    onClick={() => {
                      setActiveGuideline(guideline);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{guideline.icon}</span>
                      <div>
                        <h4 className="font-semibold dark:text-white">{guideline.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {guideline.content}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1">
          <section className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
            <div className="container max-w-6xl p-6 mx-auto space-y-8">
              {/* Header */}
              <article 
                ref={headerRef}
                className="grid gap-6 md:grid-cols-2 items-center bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src="./img/allanime.webp"
                    alt="Guide to Anime Sensei"
                    className="object-cover w-full h-64 md:h-80 transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                      Updated: January 2025
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
                    Welcome to Anime Sensei
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Anime Sensei is your one-stop platform for exploring anime
                    content, engaging with the community, and enjoying seamless
                    streaming of your favorite anime. This guide will help you
                    navigate through the platform's features, understand our
                    pricing plans, and maximize your experience.
                  </p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium">
                    <TiLocationArrow /> Watch Introduction
                  </button>
                </div>
              </article>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    imgSrc: "./img/guy.gif",
                    title: "Streaming Plans",
                    description: "Choose from our flexible streaming plans tailored to your viewing habits and budget.",
                    button: "View Plans"
                  },
                  {
                    imgSrc: "./img/entrance.webp",
                    title: "Community Engagement",
                    description: "Join discussions, share your thoughts, and make friends with fellow anime enthusiasts.",
                    button: "Join Community"
                  },
                  {
                    imgSrc: "./img/overwatch dva.webp",
                    title: "Personalized Recommendations",
                    description: "Our AI-powered recommendation system ensures you never miss anime you'll love.",
                    button: "Get Recommendations"
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    ref={(el) => (featuresRef.current[index] = el)}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        src={feature.imgSrc}
                        alt={feature.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold dark:text-white">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                      <button className="text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium flex items-center gap-1">
                        {feature.button} <TiLocationArrow className="text-sm" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Explore Button */}
              <div className="flex justify-center pt-6">
                <motion.button
                  ref={buttonRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-full shadow-lg font-medium transition-all"
                >
                  Explore All Features
                </motion.button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Guideline Modal */}
      <AnimatePresence>
        {activeGuideline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeGuideline.icon}</span>
                  <h3 className="text-xl font-bold dark:text-white">{activeGuideline.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveGuideline(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <TiTimes className="text-xl" />
                </button>
              </div>
              <div className="prose dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300">{activeGuideline.content}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setActiveGuideline(null)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuideSection;