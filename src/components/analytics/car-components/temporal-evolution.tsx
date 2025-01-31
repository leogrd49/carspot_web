import supabase from "../../../../utils/supabase";
import { useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  month: string;
  brands: number;
  models: number;
}

interface DataItem {
  created_at: string;
}

const chartConfig = {
  models: {
    label: "Models",
    color: "hsl(var(--chart-1))",
  },
  brands: {
    label: "Brands",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const TemporalEvolution = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch brands and models data in parallel
        const [brandsResult, modelsResult] = await Promise.all([
          supabase.from("brands").select("*"),
          supabase.from("models").select("*")
        ]);

        if (brandsResult.error) throw brandsResult.error;
        if (modelsResult.error) throw modelsResult.error;

        const monthNames = [
          "January", "February", "March", "April", 
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ];

        const processData = (data: DataItem[]) => {
          const monthlyData = Array.from({ length: 12 }, () => [] as DataItem[]);
          
          data.forEach(item => {
            const month = new Date(item.created_at).getMonth();
            monthlyData[month].push(item);
          });
          
          return monthlyData;
        };

        const brandsByMonth = processData(brandsResult.data);
        const modelsByMonth = processData(modelsResult.data);

        let cumulativeBrands = 0;
        let cumulativeModels = 0;

        const chartData = monthNames.map((month, index) => {
          cumulativeBrands += brandsByMonth[index].length;
          cumulativeModels += modelsByMonth[index].length;
          
          return {
            month,
            brands: cumulativeBrands,
            models: cumulativeModels,
          };
        });

        setChartData(chartData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <Card className="w-[33%]">
      <CardHeader>
        <CardTitle>Temporal Evolution</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="brands"
              type="monotone"
              stroke="var(--color-brands)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="models"
              type="monotone"
              stroke="var(--color-models)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TemporalEvolution;