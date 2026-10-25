import RatedAnime from '../components/RatedAnime'
import Slider from '../components/ui/Slider'
import SuggestedGroups from '../components/SuggestedGroups'
import AnimeNews from '../components/AnimeNews'

const CommunityPage = () => {
  return (
    <div>
      <Slider />
      <RatedAnime />
      <SuggestedGroups />
      <AnimeNews />
    </div>
  )
}

export default CommunityPage
