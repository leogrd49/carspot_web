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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      <div className="w-full">
        <RatioSuperspot />
      </div>
      <div className="w-full">
        <MostSpottedBrand />
      </div>
      <div className="w-full">
        <TemporalProgression />
      </div>
      <div className="w-full md:col-span-2">
        <SpotMap />
      </div>
      <div className="w-full">
        <MostFollowed />
      </div>
      <div className="w-full">
        <SpotTemporalEvolution />
      </div>
      <div className="w-full">
        <TimeBetweenSpot />
      </div>
      <div className="w-full">
        <FollowersRatioChart />
      </div>
      <div className="w-full">
        <SpotPerUser />
      </div>
    </div>
  );
};

export default UserStats;
