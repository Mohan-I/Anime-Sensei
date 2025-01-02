import React from "react";
import News from "../components/News";
import Ebooks from "../components/Ebooks";
import AnimatedTitle from "../components/ui/AnimatedTitle";
import Slider from "../components/ui/Slider";
import PageHero from "../components/ui/PageHero";

const NewsPage = () => {

  return (
    <div className="bg-gradient-to-t from-gray-500 to-gray-400">
      <Slider />
      <div className="relative mb-8 mt-14 flex flex-col items-center gap-5">
        <div className="font-general text-sm uppercase md:text-[10px] text-gray-600">
          Welcome to Anime Sensei
        </div>
        <PageHero
          title="<b>N</b>ews And Res<b>o</b>urces"
          containerClass="my-14 pointer-events-none relative z-10"
        />
      </div>
      <News />
      <div className="justify-items-center rounded-md mx-4 bg-white">
        <AnimatedTitle
          title="<b>o</b>ur Blo<b>g</b>s"
          containerClass="pt-14 mt-4 pointer-events-none mix-blend-difference relative z-10"
        />
        <Ebooks />
      </div>
    </div>
  );
};

export default NewsPage
