"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import supabase from "../../../../utils/supabase";

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

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig

interface FollowData {
  followed_id: string;
  count: number;
}

const MostFollowed = () => {
  const [ ,setTopUsers] = useState<FollowData[]>([]);
  const [ ,setIsLoading] = useState<boolean>(true);
  const [ , setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
        try {
            setIsLoading(true);
    
            const { data, error } = await supabase.rpc("get_top_followed_users");

            if (error) throw error;

            // Formate les données
            const formattedData: FollowData[] = (data as unknown[]).map((item) => {
                if (
                  typeof item === "object" &&
                  item !== null &&
                  "followed_id" in item &&
                  "count" in item &&
                  typeof item.followed_id === "string" &&
                  typeof item.count === "number"
                ) {
                  return {
                    followed_id: item.followed_id,
                    count: item.count,
                  };
                }
                throw new Error("Invalid data structure");
              });

            setTopUsers(formattedData);
          } catch (err) {
            console.error("Error fetching top users:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchTopUsers();
      }, []);

      return (
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs les plus suivis</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <XAxis dataKey="desktop" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="desktop"
                  layout="vertical"
                  fill="var(--color-desktop)"
                  radius={4}
                >
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="desktop"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      );
};

export default MostFollowed;
