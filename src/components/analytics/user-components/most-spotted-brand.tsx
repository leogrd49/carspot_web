"use client";
import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import postgres from "../../../../utils/postgres";
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

        // PostgreSQL query with JOIN and COUNT
        const { data, error } = await postgres.query(`
          SELECT 
            b.name as brand, 
            COUNT(*) as model_number
          FROM 
            user_collections uc
          JOIN 
            models m ON uc.model_id = m.id
          JOIN 
            brands b ON m.brand_id = b.id
          WHERE 
            uc.spotted = true
          GROUP BY 
            b.name
          ORDER BY 
            model_number DESC
          LIMIT 5
        `);

        if (error) throw error;

        // Transform data for the chart
        const formattedData: ChartData[] = data.map((item: any) => ({
          brand: item.brand,
          modelNumber: parseInt(item.model_number)
        }));

        setChartData(formattedData);
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
    <Card className="w-full">
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