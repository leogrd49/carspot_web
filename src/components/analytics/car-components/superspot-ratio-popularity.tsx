"use client";

import { useState, useEffect } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import postgres from "../../../../utils/postgres";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  superspot: {
    label: "Superspot",
    color: "hsl(var(--chart-1))",
  },
  spot: {
    label: "Spot",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const SuperspotRatioAndPopularity = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setIsLoading(true);

        // PostgreSQL query to get all collections with created_at and superspot status
        const { data, error } = await postgres.query(`
          SELECT created_at, superspot 
          FROM user_collections
        `);

        if (error) throw error;

        // Organiser les données par mois
        const monthNames = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December",
        ];

        const monthlyData = Array.from({ length: 12 }, (_, index) => {
          const monthItems = data.filter((item: any) => {
            const date = new Date(item.created_at);
            return date.getMonth() === index;
          });

          const totalSuperspot = monthItems.filter((item: any) => item.superspot)
            .length;
          const totalSpot = monthItems.length;

          const ratioSuperspot =
            totalSpot > 0
              ? Math.floor((totalSuperspot / totalSpot) * 10000) / 100
              : 0;

          return {
            month: monthNames[index],
            superspot: totalSuperspot,
            spot: totalSpot,
            ratio: ratioSuperspot,
          };
        });

        setMonthlyData(monthlyData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>Super Spot Ratio & Popularity</CardTitle>
        <CardDescription>
          Showing cumulative ratios for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={monthlyData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="ratio"
              fill="var(--color-superspot)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing the ratio evolution per month
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default SuperspotRatioAndPopularity;