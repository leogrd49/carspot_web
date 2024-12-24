import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart, Pie,
  RadialBarChart, RadialBar,
  ScatterChart, Scatter,
  ResponsiveContainer,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

// Types
interface MetricWithTrendProps {
  title: string;
  value: number;
  trend: number;
  className?: string;
}



interface HeatMapDataPoint {
  hour: number;
  day: number;
  value: number;
}

interface HeatMapChartProps {
  data: HeatMapDataPoint[];
  className?: string;
}

interface PieChartDataPoint {
  name: string;
  value: number;
}

interface PieChartWithLegendProps {
  data: PieChartDataPoint[];
  className?: string;
}

interface GaugeChartProps {
  value: number;
  className?: string;
}

// Composant pour les métriques avec flèche d'évolution
export const MetricWithTrend: React.FC<MetricWithTrendProps> = ({ title, value, trend, className }) => {
  const getTrendIcon = (trend: number): string => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  const getTrendColor = (trend: number): string => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className={`text-xl ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)} {Math.abs(trend)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour le Pie Chart avec légende
export const PieChartWithLegend: React.FC<PieChartWithLegendProps> = ({ data, className }) => {
  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Répartition</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Composant pour la Heat Map
export const HeatMapChart: React.FC<HeatMapChartProps> = ({ data, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Heat Map Horaire</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" type="number" domain={[0, 23]} />
            <YAxis dataKey="day" type="number" domain={[0, 6]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Composant pour le Gauge Chart
export const GaugeChart: React.FC<GaugeChartProps> = ({ value, className }) => {
  const data = [{ name: 'score', value: value }];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Gauge</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart 
            innerRadius="60%" 
            outerRadius="100%" 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              fill="#8884d8"
            />
            <Legend />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default {
  MetricWithTrend,
  PieChartWithLegend,
  HeatMapChart,
  GaugeChart
};