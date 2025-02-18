import PrivilegedSchedules from './privileged-schedules';
import SpotFrequency from './spot-frequency';
import TemporalEvolution from './temporal-evolution';
import SuperspotRatioAndPopularity from './superspot-ratio-popularity';
import SpotPerRarity from './spot-per-rarity'

// Composant pour les statistiques voiture
const CarStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-fit">
      <div className="w-full">
        <SpotFrequency />
      </div>
      <div className="w-full">
        <TemporalEvolution />
      </div>
      <div className="w-full">
        <SuperspotRatioAndPopularity />
      </div>
      <div className="w-full">
        <SpotPerRarity />
      </div>
      <div className="w-full overflow-x-auto">
        <PrivilegedSchedules />
      </div>
    </div>
  );
};

export default CarStats;
