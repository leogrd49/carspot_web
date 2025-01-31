"use client"

import { useState, useEffect } from "react";
import { GitCommitVertical } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import supabase from "../../../../utils/supabase";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// Interface pour les données du graphique
interface ChartData {
  month: string;
  desktop: number;
}

interface DataItem {
  created_at: string;
}

const TemporalProgression = () => {

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Requête avec jointures et comptage
        const { data, error } = await supabase
          .from("profiles")
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

        // Initialisation de la variable pour stocker la somme cumulative
        let cumulativeSum = 0;

        // Générer les données cumulatives pour le graphique
        const chartData = monthlyData.map((monthData, index) => {
          // Calcul de la somme cumulative
          cumulativeSum += monthData.length;

          return {
            month: monthNames[index], // Nom du mois
            desktop: cumulativeSum,  // Total cumulatif jusqu'à ce mois
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



  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur : {error}</div>;

  
  return (
    <Card className="w-[30%]">
      <CardHeader>
        <CardTitle>Progression temporelle</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24
                return (
                  <GitCommitVertical
                    key={payload.month}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-desktop)"
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
export default TemporalProgression;
