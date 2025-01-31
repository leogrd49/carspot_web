"use client"
import { useState, useEffect } from "react";
import supabase from "../../../../utils/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface UserCollection {
  user_id: string;
  spotted_date: string;
}

interface UserGroup {
  userId: string;
  spotted_dates: Date[];
}

interface UserGroups {
  [key: string]: UserGroup;
}

interface UserAverage {
  userId: string;
  averageTimeDifference: number;
  averageTimeDifferenceHours: number;
}

interface AnalysisResult {
  userAverages: UserAverage[];
  globalAverageMs: number;
  globalAverageHours: number;
}

const TimeBetweenSpot = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_collections')
          .select('user_id, spotted_date')
          .order('spotted_date');

        if (error) throw error;

        const userCollections = data as UserCollection[];
        const userGroups = userCollections.reduce<UserGroups>((acc, collection) => {
          if (!acc[collection.user_id]) {
            acc[collection.user_id] = {
              userId: collection.user_id,
              spotted_dates: []
            };
          }
          acc[collection.user_id].spotted_dates.push(new Date(collection.spotted_date));
          return acc;
        }, {});

        const userAverages = Object.values(userGroups).map((user: UserGroup) => {
          const differences = [];
          for (let i = 1; i < user.spotted_dates.length; i++) {
            const diff = user.spotted_dates[i].getTime() - user.spotted_dates[i-1].getTime();
            differences.push(diff);
          }
          
          const averageTimeDiff = differences.length > 0
            ? differences.reduce((a, b) => a + b, 0) / differences.length
            : 0;

          return {
            userId: user.userId,
            averageTimeDifference: averageTimeDiff,
            averageTimeDifferenceHours: averageTimeDiff / (1000 * 60 * 60)
          };
        });

        const globalAverage = userAverages.reduce((acc, user) => {
          return acc + user.averageTimeDifference;
        }, 0) / userAverages.length;

        setAnalysisData({
          userAverages,
          globalAverageMs: globalAverage,
          globalAverageHours: globalAverage / (1000 * 60 * 60)
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        setError(errorMessage);
        console.error('Erreur lors de l\'analyse:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (hours: number) => {
    if (hours < 1/60) {
      return `${Math.round(hours * 3600)} secondes`;
    } else if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else {
      return `${hours.toFixed(1)} heures`;
    }
  };

  return (
    <Card className="w-[30%]">
      <CardHeader>
        <CardTitle className="text-lg">
          Temps moyen entre les spots
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center">Chargement...</div>
        ) : error ? (
          <div className="text-red-500">Erreur: {error}</div>
        ) : analysisData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {formatTime(analysisData.globalAverageHours)}
              </span>
              <span className="text-gray-500">en moyenne globale</span>
            </div>
            {/* <div className="space-y-2">
              {analysisData.userAverages.map(user => (
                <div key={user.userId} className="flex justify-between items-center">
                  <span>Utilisateur {user.userId}</span>
                  <span className="font-medium">
                    {formatTime(user.averageTimeDifferenceHours)}
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TimeBetweenSpot;