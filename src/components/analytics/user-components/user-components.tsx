  import TemporalProgression from './temporal-progression';
  import SpotTotalScore from './spot-total-score';
  import RatioSuperspot from './ratio-superspot';
  import MostSpottedBrand from './most-spotted-brand';
// Composant pour les statistiques utilisateur
const UserStats = () => {
  
    return (
      <div className="flex flex-wrap gap-4">
        <SpotTotalScore />
        <RatioSuperspot />
        <MostSpottedBrand />
        <TemporalProgression />
      </div>
    );
  };

export default UserStats;
