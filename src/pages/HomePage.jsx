import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import Story from '../components/Story'
import Contact from '../components/Contact'
import TrendingCharts from '../components/TrendingCharts'

const HomePage = () => {
  return (
      <>
      <Hero />
      <TrendingCharts />
      <About />
      <Features />
      <Story />
      <Contact />
      </>
  )
}

export default HomePage
