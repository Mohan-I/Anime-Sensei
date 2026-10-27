import React, { useState } from "react";
import { data } from "../data/data";
import { Link } from "react-router-dom"; // Assuming you might want to link these

const AGE_GROUPS = ["All Ages", "Teens", "Mature"];
const CATEGORIES = ["action", "romantic", "horror", "thriller"];

const RatedAnime = () => {
  const [rates, setRates] = useState(data);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeAge, setActiveAge] = useState("All");

  // Combine filters so they work together
  const applyFilters = (category, age) => {
    let filtered = data;
    if (category !== "All") filtered = filtered.filter((item) => item.category === category);
    if (age !== "All") filtered = filtered.filter((item) => item.ageGroup === age);
    setRates(filtered);
  };

  const handleCategoryClick = (cat) => {
    const newCat = activeCategory === cat ? "All" : cat;
    setActiveCategory(newCat);
    applyFilters(newCat, activeAge);
  };

  const handleAgeClick = (age) => {
    const newAge = activeAge === age ? "All" : age;
    setActiveAge(newAge);
    applyFilters(activeCategory, newAge);
  };

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveAge("All");
    setRates(data);
  };

  // Base button styles
  const pillBase = "px-4 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 capitalize";
  const pillInactive = "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white";
  const pillActive = "border-violet-400/50 bg-violet-500/20 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.2)]";

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_60%)]" />

      <div className="relative mx-auto max-w-[1400px]">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-green-600 special-font hero-heading text-4xl text-center mb-8">Top R<b>a</b>t<b>e</b>d <b>A</b>ni<b>me</b></h1>
          <p className="mt-2 text-sm text-white/50">Discover your next favorite series</p>
        </div>

        {/* Filters Container */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
          
          {/* Category Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Genre</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetFilters}
                className={`${pillBase} ${activeCategory === "All" && activeAge === "All" ? pillActive : pillInactive}`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`${pillBase} ${activeCategory === cat ? pillActive : pillInactive}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Age Rating Filter */}
          <div className="flex flex-col gap-3 lg:items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Age Recommendation</span>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  onClick={() => handleAgeClick(age)}
                  className={`${pillBase} ${activeAge === age ? pillActive : pillInactive}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-white/40">
          Showing {rates.length} result{rates.length !== 1 && 's'}
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {rates.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_12px_30px_-10px_rgba(139,92,246,0.3)]"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Age Badge Overlay (Top Right) */}
                <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md ring-1 ring-white/20">
                  {item.ageGroup}
                </div>

                {/* Category Badge Overlay (Bottom Left) */}
                <div className="absolute bottom-2 left-2 rounded-md bg-violet-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                  {item.category}
                </div>
              </div>

              {/* Title Container */}
              <div className="flex flex-1 flex-col justify-center bg-white/[0.02] p-3">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 transition-colors group-hover:text-violet-300">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {rates.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white/50">No anime found matching those filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-sm font-semibold text-violet-400 hover:text-violet-300"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RatedAnime;