import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

const AboutSection = () => {
  const features = [
    "Expert community support",
    "Daily new content",
    "Premium quality resources",
    "Ad-free experience",
    "Mobile optimized",
    "Secure platform"
  ];

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Images Grid - Left Side */}
          <motion.div 
            className="w-full lg:w-6/12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariants}
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <motion.div 
                className="relative group"
                variants={imageVariants}
              >
                <img
                  src="./img/giphy (1).webp"
                  alt="Community content"
                  className="w-full h-auto rounded-xl shadow-lg border-4 border-white dark:border-gray-800 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-medium">Daily Content</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group mt-8"
                variants={imageVariants}
              >
                <img
                  src="./img/quote.jpeg"
                  alt="Testimonials"
                  className="w-full h-auto rounded-xl shadow-lg border-4 border-white dark:border-gray-800 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-medium">Member Quotes</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group col-span-2"
                variants={imageVariants}
              >
                <img
                  src="./img/dev.png"
                  alt="Featured author"
                  className="w-full h-auto rounded-xl shadow-lg border-4 border-white dark:border-gray-800 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-medium">Featured Creator</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content - Right Side */}
          <motion.div 
            className="w-full lg:w-6/12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textVariants}
          >
            <div className="max-w-lg mx-auto lg:mx-0">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                Why Choose Us
              </span>
              
              <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
                Discover Our <span className="text-blue-600 dark:text-blue-400">Community</span>
              </h2>
              
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                We're more than just a platform - we're a thriving community of anime enthusiasts 
                dedicated to bringing you the best content and experiences.
              </p>
              
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                With thousands of active members and new content daily, we provide a space where 
                fans can connect, share, and grow together in a secure, ad-free environment.
              </p>
              
              <motion.ul 
                className="mb-8 space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerVariants}
              >
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center space-x-3"
                    variants={featureVariants}
                  >
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 group"
              >
                Join Now
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;