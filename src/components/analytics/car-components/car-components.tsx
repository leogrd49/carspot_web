  import PrivilegedSchedules from './privileged-schedules';
  import SpotFrequency from './spot-frequency';
  import TemporalEvolution from './temporal-evolution';
  import SuperspotRatioAndPopularity from './superspot-ratio-popularity';

// Composant pour les statistiques voiture
const CarStats = () => { 
    return (
      <div className="flex flex-wrap gap-4">
          <SpotFrequency />
          <PrivilegedSchedules />
          <TemporalEvolution />
          <SuperspotRatioAndPopularity />
      </div>
    );
  };

export default CarStats;
