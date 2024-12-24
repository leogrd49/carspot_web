  import TemporalProgression from './temporal-progression';
  import SpotTotalScore from './spot-total-score';
  import RatioSuperspot from './ratio-superspot';
  import MostSpottedBrand from './most-spotted-brand';
  import CompletionRate from './completion-rate';
// Composant pour les statistiques utilisateur
const UserStats = () => {
  
    return (
      <div className="flex flex-wrap gap-4">
        <SpotTotalScore />
        <RatioSuperspot />
        <MostSpottedBrand />
        <TemporalProgression />
        <CompletionRate />
      </div>
    );
  };

export default UserStats;
