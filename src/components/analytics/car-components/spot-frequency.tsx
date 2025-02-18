import { useState, useEffect } from "react";
import supabase from "../../../../utils/supabase";

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
const SpotFrequency = () =>{

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Requête avec jointures et comptage
        const { data, error } = await supabase
          .from("user_collections")
          .select(`*`)

        if (error) throw error;

        // Initialisation du tableau de regroupement par mois
        const monthlyData: DataItem[][] = Array.from({ length: 12 }, () => []);

        // Parcourir tous les mois (de 0 à 11)
        for (let month = 0; month < 12; month++) {
          const filteredData = data.filter(item => {
            const date = new Date(item.created_at);
            return date.getMonth() === month; // 0 = janvier
          });

          // Stocker les données filtrées dans le tableau par mois
          monthlyData[month] = filteredData;
        }

        // Tableau des noms des mois
        const monthNames = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ];



        const chartData = monthlyData.map((monthData, index) => {
          return {
            month: monthNames[index], // Nom du mois
            spots: monthData.length, // Nombre d'éléments pour ce mois (ajustez selon vos données)
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
