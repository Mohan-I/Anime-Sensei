import React from "react";
import { TiArrowForward, TiCalendar } from "react-icons/ti";

// Component for the Ebook Card
const EbookCard = ({ title, date, image, alt, link }) => {
  return (
    <div className="md:w-1/3 h-64 md:px-2">
      <div className="relative group h-full w-full" data-aos="flip-left">
        <div className="relative h-full">
          <figure className="h-full">
            <img
              className="w-full h-full object-cover"
              src={image}
              alt={alt}
              loading="lazy"
            />
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4, 7, 14, 0) 0%, rgba(4, 7, 14, 0.6) 100%)",
              }}
            ></div>
          </figure>
        </div>
        <div className="absolute border-2 bottom-0 bg-white w-full flex flex-col justify-center p-6 text-primary transition-all group-hover:justify-start group-hover:pb-6">
          <div className="transition-all group-hover:translate-y-[-20%] flex flex-col">
            <div className="flex items-center md:justify-start justify-center">
              <TiCalendar />
              <p className="font-robert-medium">{date}</p>
            </div>
            <h5 className="md:text-start text-center">
              <a href={link} className="h5 font-general hover:text-teal-500 font-bold">
                {title}
              </a>
            </h5>
          </div>
          <div className="hidden group-hover:block transition-all">
            <a
              href={link}
              className="flex gap-2 items-center h6 font-main hover:text-secondary md:justify-start justify-center"
            >
              Read More
              <TiArrowForward />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component for Ebooks
const Ebooks = () => {
  const ebooks = [
    {
      title: "Transforming and Changing Lives With Anime",
      date: "April 25, 2024",
      image: "/img/bg1.webp",
      alt: "blog_1",
      link: "#",
    },
    {
      title: "How Anime Is Changing The Face Of Marketing",
      date: "April 25, 2024",
      image: "/img/image.webp",
      alt: "blog_2",
      link: "#",
    },
    {
      title: "Exploring The Ethics Of Anime Fanarts",
      date: "April 25, 2024",
      image: "/img/bgcmp.gif",
      alt: "blog_3",
      link: "#",
    },
    {
      title: "HunterX Future - Collaboration or Cooperation?",
      date: "April 25, 2024",
      image: "/img/error.gif",
      alt: "blog_4",
      link: "#",
    },
    {
      title: "From Fantasy to Reality: The Journey of Anime",
      date: "April 25, 2024",
      image: "/img/guy.gif",
      alt: "blog_5",
      link: "#",
    },
    {
      title: "Exploring the Economy of Anime",
      date: "April 25, 2024",
      image: "/img/rain.gif",
      alt: "blog_6",
      link: "#",
    },
  ];

  return (
    <div>
      <section className="lg:py-[100px] md:py-[70px] py-[50px]">
        <div className="container">
          <div className="flex md:flex-row flex-col md:gap-x-0 gap-x-6 flex-wrap gap-y-6">
            {ebooks.map((ebook, index) => (
              <EbookCard
                key={index}
                title={ebook.title}
                date={ebook.date}
                image={ebook.image}
                alt={ebook.alt}
                link={ebook.link}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ebooks;
