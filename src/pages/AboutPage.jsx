import React from 'react'
import AboutSection from '../components/AboutSection'
import Story from '../components/Story'
import GlitchText from '../components/ui/GlitchText'
import Testimonials from '../components/Testimonials'
import Card from '../components/ui/DetailsCard' 
import { TiStarFullOutline, TiStarHalfOutline } from 'react-icons/ti'

const AboutPage = () => {
  const cardData = {
    title: "About Our Company",
    paragraph: "We are a company that helps people achieve their goals with passion and dedication.",
    listItems: [
      "Providing innovative solutions",
      "Helping businesses grow",
      "Dedicated to customer success",
    ],
    buttonText: "Learn More",
  };

  return (
    <>
      <GlitchText 
        title="About Us"
        bgImage="./img/bg2.webp"
        subtitle="What We Do"
      />
      <AboutSection />
      <Story />
      {/* About Section */}
      <section className="py-16 px-6 md:px-16">
        <div style={{ backgroundImage: `url('./img/rain.gif')` }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card 
            title={cardData.title}
            paragraph={cardData.paragraph}
            listItems={cardData.listItems}
            buttonText={cardData.buttonText}
          />
          <div className="flex flex-col bg-black opacity-60 justify-center space-y-6">
            <h2 className="text-2xl opacity-100 font-semibold text-blue-50">
              Who We Are
            </h2>
            <p className="text-lg opacity-100 text-blue-50">
              Our founders Dustin Moskovitz and Justin Rosenstein met while leading Engineering teams at Facebook. As operations scaled, they grew frustrated by how difficult it was.
            </p>
            <p className="text-lg opacity-100 text-blue-50">
              Avg 4.8 rating makes us the best agency globally.
            </p>
            <div className="flex mb-0 pl-0 list-none rating">
              <ul className="flex mb-0 pl-0 list-none rating">
                <li className="text-yellow-500 mr-1"><TiStarFullOutline /></li>
                <li className="text-yellow-500 mr-1"><TiStarFullOutline /></li>
                <li className="text-yellow-500 mr-1"><TiStarFullOutline /></li>
                <li className="text-yellow-500 mr-1"><TiStarFullOutline /></li>
                <li className="text-yellow-500"><TiStarHalfOutline /></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials />
    </>
  )
}

export default AboutPage
