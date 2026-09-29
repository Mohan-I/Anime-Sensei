import React from 'react'
import GuideSection from '../components/GuideSection'
import PricingPlan from '../components/PricingPlan'
import Contact from '../components/Contact'
import PageHero from "../components/ui/PageHero"
import GlitchText from "../components/ui/GlitchText"

const GuidePage = () => {
  return (
    <div>
        <GlitchText
        title="GUIDE"
        bgImage="./img/tech.gif"
        subtitle="Sensei's Documentation"
      />
      <PageHero
        title="<b>gu</b>id<b>e</b>lines of the pl<b>a</b>tfo<b>rm</b>"
        containerClass="my-14 pointer-events-none mix-blend-difference relative z-10"
      />
      <GuideSection />
      <PricingPlan />
      <Contact />
    </div>
  )
}

export default GuidePage
