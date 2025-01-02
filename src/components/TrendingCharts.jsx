import React from "react";
import Button from "./ui/Button";
import { TiLocationArrow } from "react-icons/ti";
import { NavLink } from "react-router-dom";

const TrendingCharts = () => {
  return (
    <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-4 gap-6">
      {/* card */}
      <div className="rounded-xl  relative ">
        {/* overlay */}
        <div className="absolute px-2 w-full h-full bg-black/50 rounded-lg text-white">
          <p className="font-bold text-2xl px-2 pt-4">Action Anime</p>
          <p className="px-2 text-violet-50">Through 8/26</p>
          <NavLink to="/anime">
            <Button
              id="watch-trailer"
              title="Watch Now"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-emerald-500 hover:bg-purple-500 hover:text-blue-50 flex-center bottom-4 absolute gap-1"
            />
          </NavLink>
        </div>
        <img
          className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
          src="./img/Blog (4).webp"
          alt=""
        />
      </div>

      {/* card */}
      <div className="rounded-xl  relative">
        {/* overlay */}
        <div className="absolute px-2 w-full h-full bg-black/50 rounded-lg text-white">
          <p className="font-bold text-2xl px-2 pt-4">Romantic Anime</p>
          <p className="px-2 text-violet-50">Through 8/26</p>
          <NavLink to="/anime">
            <Button
              id="watch-trailer"
              title="Watch Now"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-emerald-500 hover:bg-purple-500 hover:text-blue-50 flex-center bottom-4 absolute gap-1"
            />
          </NavLink>
        </div>
        <img
          className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
          src="./img/Blog.webp"
          alt=""
        />
      </div>

      {/* card */}
      <div className="rounded-xl  relative">
        {/* overlay */}
        <div className="absolute px-2 w-full h-full bg-black/50 rounded-lg text-white">
          <p className="font-bold text-2xl px-2 pt-4">Horror Anime</p>
          <p className="px-2 text-violet-50">Through 8/26</p>
          <NavLink to="/anime">
            <Button
              id="watch-trailer"
              title="Watch Now"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-emerald-500 hover:bg-purple-500 hover:text-blue-50 flex-center bottom-4 absolute gap-1"
            />
          </NavLink>
        </div>
        <img
          className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
          src="./img/Blog (5).webp"
          alt=""
        />
      </div>

      {/* card */}
      <div className="rounded-xl  relative">
        {/* overlay */}
        <div className="absolute px-2 w-full h-full bg-black/50 rounded-lg text-white">
          <p className="font-bold text-2xl px-2 pt-4">Thriller Anime</p>
          <p className="px-2 text-violet-50">Through 8/26</p>
          <NavLink to="/anime">
            <Button
              id="watch-trailer"
              title="Watch Now"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-emerald-500 hover:bg-purple-500 hover:text-blue-50 flex-center bottom-4 absolute gap-1"
            />
          </NavLink>
        </div>
        <img
          className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
          src="./img/Blog (7).webp"
          alt=""
        />
      </div>
    </div>
  );
};

export default TrendingCharts;
