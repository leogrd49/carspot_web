  import TemporalProgression from './temporal-progression';
  import RatioSuperspot from './ratio-superspot';
  import MostSpottedBrand from './most-spotted-brand';
  import MostFollowed from './most-followed'
  import SpotTemporalEvolution from './spot-temporal-evolution'
  import TimeBetweenSpot from './time-between-spot';
  import FollowersRatioChart from './follower-following-ratio';
  import SpotPerUser from './spot-per-user';
  import SpotMap from './spot-map'
const UserStats = () => {
  
    return (
      <div className="flex flex-wrap gap-4">
        <RatioSuperspot />
        <MostSpottedBrand />
        <TemporalProgression />
        <SpotMap />
        <MostFollowed />
        <SpotTemporalEvolution />
        <TimeBetweenSpot />
        <FollowersRatioChart />
        <SpotPerUser />
      </div>
    );
  };

export default UserStats;
