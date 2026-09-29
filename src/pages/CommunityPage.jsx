import React from 'react'
import RatedAnime from '../components/RatedAnime'
import Slider from '../components/ui/Slider'
import SuggestedGroups from '../components/SuggestedGroups'

const CommunityPage = () => {
  return (
    <div>
      <Slider />
      <RatedAnime />
      <SuggestedGroups />
    </div>
  )
}

export default CommunityPage
