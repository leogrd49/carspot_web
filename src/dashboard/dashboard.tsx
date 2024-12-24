import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricWithTrend, RadarMetrics, HeatMapChart, PieChartWithLegend, GaugeChart } from '../components/stats-component.tsx';

const UserStatsPage = () => {
  // Données mockées pour l'exemple
  const statsData = {
    totalSpots: { value: 1234, trend: 5.2 },
    score: { value: 8750, trend: 2.8 },
    superSpotRatio: 75,
    topBrands: [
      { name: 'Ferrari', value: 45 },
      { name: 'Porsche', value: 38 },
      { name: 'Lamborghini', value: 27 },
      { name: 'McLaren', value: 21 },
      { name: 'Bugatti', value: 12 }
    ],
    activityHeatMap: Array.from({ length: 24 * 7 }, (_, i) => ({
      hour: i % 24,
      day: Math.floor(i / 24),
      value: Math.floor(Math.random() * 100)
    }))
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Statistiques Utilisateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricWithTrend
          title="Total Spots"
          value={statsData.totalSpots.value}
          trend={statsData.totalSpots.trend}
        />
        <MetricWithTrend
          title="Score Total"
          value={statsData.score.value}
          trend={statsData.score.trend}
        />
        <GaugeChart value={statsData.superSpotRatio} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartWithLegend data={statsData.topBrands} />
        <HeatMapChart data={statsData.activityHeatMap} />
      </div>
    </div>
  );
};

export default UserStatsPage;