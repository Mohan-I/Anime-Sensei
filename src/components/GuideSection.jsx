import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Button from "../components/ui/Button";
import { TiLocationArrow } from "react-icons/ti";


const GuideSection = () => {
  const headerRef = useRef(null);
  const featuresRef = useRef([]);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(null);
  const mainSectionRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

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

  useEffect(() => {
    // Intersection Observer for sticky sidebar
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: "-50px 0px -50px 0px" } // Adjust margins for precise detection
    );

    if (mainSectionRef.current) {
      observer.observe(mainSectionRef.current);
    }

    return () => {
      if (mainSectionRef.current) {
        observer.unobserve(mainSectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            className={`${
              isSticky ? "sticky top-0" : ""
            } h-full p-6 bg-gray-50 dark:bg-gray-800 rounded shadow-md lg:w-1/4`}
          >
            <h3 className="text-xl font-semibold dark:text-gray-200">
              Website Guidelines
            </h3>
            <ul className="mt-4 space-y-2 list-disc list-inside dark:text-gray-400">
              <li>Always use respectful and inclusive language.</li>
              <li>Do not share or promote illegal content.</li>
              <li>Ensure your account details are secure.</li>
              <li>Follow community guidelines when posting in forums.</li>
              <li>Contact support for any technical or account-related issues.</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main ref={mainSectionRef} className="flex-1">
            <section className="dark:bg-gray-100 dark:text-gray-800">
              <div
                ref={headerRef}
                className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12"
              >
                {/* Header */}
                <article className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-50">
                  <img
                    src="./img/allanime.webp"
                    alt="Guide to Anime Sensei"
                    className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
                  />
                  <div className="p-6 space-y-2 lg:col-span-5">
                    <h3 className="text-2xl font-robert-medium sm:text-4xl">
                      Welcome to Anime Sensei
                    </h3>
                    <span className="text-xs dark:text-gray-600">
                      Updated: January 2025
                    </span>
                    <p>
                      Anime Sensei is your one-stop platform for exploring anime
                      content, engaging with the community, and enjoying seamless
                      streaming of your favorite anime. This guide will help you
                      navigate through the platform's features, understand our
                      pricing plans, and maximize your experience.
                    </p>
                    <Button
                      id="watch-trailer"
                      title="Watch Now"
                      leftIcon={<TiLocationArrow />}
                      containerClass="bg-yellow-300 flex-center gap-2"
                    />
                  </div>
                </article>

                {/* Features */}
                <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      imgSrc: "./img/guy.gif",
                      title: "Streaming Plans",
                      description: "Choose from our flexible streaming plans...",
                    },
                    {
                      imgSrc: "./img/entrance.webp",
                      title: "Community Engagement",
                      description:
                        "Join discussions, share your thoughts, and make friends...",
                    },
                    {
                      imgSrc: "./img/overwatch dva.webp",
                      title: "Personalized Recommendations",
                      description:
                        "Our AI-powered recommendation system ensures...",
                    },
                    {
                      imgSrc: "./img/Blog (1).jpg",
                      title: "Offline Downloads",
                      description: "Enjoy anime on the go! Download episodes...",
                    },
                    {
                      imgSrc: "./img/blog4.webp",
                      title: "Parental Controls",
                      description:
                        "Manage your kids' viewing experience with robust controls...",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      ref={(el) => (featuresRef.current[index] = el)}
                      className={`max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50 ${
                        index >= 3 ? "hidden sm:block" : ""
                      }`}
                    >
                      <img
                        role="presentation"
                        className="object-cover w-full rounded h-44 dark:bg-gray-500"
                        src={feature.imgSrc}
                        alt={feature.title}
                      />
                      <div className="p-6 space-y-2">
                        <h3 className="text-2xl font-robert-medium">{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explore Button */}
                <div className="flex justify-center">
                  <button
                    ref={buttonRef}
                    type="button"
                    className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-50 dark:text-gray-600"
                  >
                    Explore More Features...
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default GuideSection;
