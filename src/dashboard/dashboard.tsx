import { useState, useEffect } from 'react';
import { MetricWithTrend } from '../components/dashboard/stats-component.tsx';
import supabase from '../../utils/supabase.tsx';

const UserStatsPage = () => {
  const [totalSpots, setTotalSpots] = useState(0);
  const [totalModels, setTotalModels] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalSpots = async () => {
      try {
        const { count: spotsCount, error: spotsError } = await supabase
          .from('user_collections')
          .select('*', { count: 'exact', head: true })
          .eq('spotted', true);

        if (spotsError) throw spotsError;

        setTotalSpots(spotsCount ?? 0);
      } catch (error) {
        console.error('Error fetching total spots:', error);
        setTotalSpots(0);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTotalModels = async () => {
      try {
        const { count: modelsCount, error: modelsError } = await supabase
          .from('models')
          .select('*', { count: 'exact', head: true })

        if (modelsError) throw modelsError;

        setTotalModels(modelsCount ?? 0);
      } catch (error) {
        console.error('Error fetching total spots:', error);
        setTotalModels(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalSpots();
    fetchTotalModels();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Statistiques Globales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricWithTrend
          title="Total Spots"
          value={totalSpots}
          trend={5.2}
        />
        <MetricWithTrend
          title="Nombre Model"
          value={totalModels}
          trend={0}
        />
      </div>
    </div>
  );
};

export default UserStatsPage;