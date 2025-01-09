"use client";

import { TrendingUp } from "lucide-react";
import {
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import supabase from "../../../../utils/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

type ChartData = { name: string; value: number; fill: string };

const FollowersRatioChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [ratio, setRatio] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("follows")
          .select("follower_id, followed_id");

        if (error) throw error;

        const followersCount: Record<string, number> = {};
        const followingCount: Record<string, number> = {};

        // Comptez les followers et followings pour chaque utilisateur
        data.forEach((follow) => {
          followersCount[follow.followed_id] =
            (followersCount[follow.followed_id] || 0) + 1;
          followingCount[follow.follower_id] =
            (followingCount[follow.follower_id] || 0) + 1;
        });

        const totalUsers = Object.keys(followersCount).length;
        const totalFollowers = Object.values(followersCount).reduce(
          (acc, val) => acc + val,
          0
        );
        const totalFollowing = Object.values(followingCount).reduce(
          (acc, val) => acc + val,
          0
        );

        const avgFollowers = totalFollowers / totalUsers;
        const avgFollowing = totalFollowing / totalUsers;
        const avgRatio = avgFollowers / avgFollowing;

        setChartData([
          {
            name: "Followers",
            value: parseFloat(avgFollowers.toFixed(2)),
            fill: "#8884d8",
          },
          {
            name: "Following",
            value: parseFloat(avgFollowing.toFixed(2)),
            fill: "#82ca9d",
          },
        ]);
        setRatio(parseFloat(avgRatio.toFixed(2)));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Followers/Following</CardTitle>
        <CardDescription>Ratio moyen des utilisateurs</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={{
            innerRadius: 20, 
            outerRadius: 100, 
            startAngle: 180,
            endAngle: 0,
          }}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            width={300}
            height={300}
            data={chartData}
            innerRadius="20%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
          >
            <PolarRadiusAxis tick={false} />
            <RadialBar
              label={{ position: "insideStart", fill: "#fff" }}
              background
              dataKey="value"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <text
              x={150}
              y={150}
              textAnchor="middle"
              className="text-2xl font-bold"
            >
              {ratio}
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Ratio followers/following moyen : {ratio}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Moyennes calculées sur tous les utilisateurs
        </div>
      </CardFooter>
    </Card>
  );
};

export default FollowersRatioChart;
