"use client";
import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import supabase from "../../../../utils/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interface pour les données du graphique
interface ChartData {
  brand: string;
  modelNumber: number;
}

// Configuration du graphique
const chartConfig = {
  modelNumber: {
    label: "Nombre de spots :",
    color: "hsl(var(--chart-1))",
  },
};

const MostSpottedBrand = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Requête avec jointures et comptage
        const { data, error } = await supabase
          .from("user_collections")
          .select(`
            model_id,
            models (
              brand_id,
              brands (
                name
              )
            )
          `)
          .eq("spotted", true);

        if (error) throw error;

        
        // Transformation des données pour le graphique
        const brandCounts = data.reduce((acc: Record<string, number>, item: any) => {
          const brandName = item.models?.brands?.name;
          if (brandName) {
            acc[brandName] = (acc[brandName] || 0) + 1;
          }
          return acc;
        }, {});

        const formattedData: ChartData[] = Object.entries(brandCounts).map(
          ([brand, count]) => ({
            brand,
            modelNumber: count,
          })
        );

        // Trier et limiter aux 5 premières marques
        const sortedData = formattedData
          .sort((a, b) => b.modelNumber - a.modelNumber)
          .slice(0, 5);

        setChartData(sortedData);
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
    <Card className="w-[33%]">
      <CardHeader>
        <CardTitle>Marques les plus spottées</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 40,
            }}
          >
            <XAxis type="number" dataKey="modelNumber" hide />
            <YAxis
              dataKey="brand"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="modelNumber" fill="var(--color-modelNumber)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MostSpottedBrand;
