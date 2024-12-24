  import PrivilegedSchedules from './privileged-schedules';
  import SpotFrequency from './spot-frequency';

// Composant pour les statistiques voiture
const CarStats = () => { 
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpotFrequency />
          <PrivilegedSchedules />
      </div>
    );
  };

export default CarStats;
