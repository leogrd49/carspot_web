import { useState, useEffect } from "react";
import postgres from "../../../../utils/postgres";

import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

// Interface pour les données du graphique
interface ChartData {
  month: string;
  spots: number;
}

interface DataItem {
  created_at: string;
}

const SpotFrequency = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Requête PostgreSQL pour obtenir tous les user_collections
        const { data, error } = await postgres.query(
          `SELECT created_at FROM user_collections`
        );

        if (error) throw error;

        // Tableau des noms des mois
        const monthNames = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ];

        // Initialisation du tableau de regroupement par mois
        const monthlyData: DataItem[][] = Array.from({ length: 12 }, () => []);

        // Parcourir tous les mois (de 0 à 11)
        for (let month = 0; month < 12; month++) {
          const filteredData = data.filter((item: DataItem) => {
            const date = new Date(item.created_at);
            return date.getMonth() === month; // 0 = janvier
          });

          // Stocker les données filtrées dans le tableau par mois
          monthlyData[month] = filteredData;
        }

        const chartData = monthlyData.map((monthData, index) => {
          return {
            month: monthNames[index], // Nom du mois
            spots: monthData.length, // Nombre d'éléments pour ce mois
          };
        });

        setChartData(chartData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Fréquence Spots</h3>
        <BarChart width={400} height={300} data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="spots" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  )
}

export default SpotFrequency;