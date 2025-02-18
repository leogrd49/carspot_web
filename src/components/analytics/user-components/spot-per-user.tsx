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
}

interface UserAverage {
  userId: string;
  spotCount: number;
}

interface AnalysisResult {
  userAverages: UserAverage[];
  globalAverage: number;
}

const SpotPerUser = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_collections')
          .select('user_id');

        if (error) throw error;

        const userCollections = data as UserCollection[];

        // Regrouper par utilisateur et compter les spots
        const userSpots = userCollections.reduce<Record<string, number>>((acc, collection) => {
          acc[collection.user_id] = (acc[collection.user_id] || 0) + 1;
          return acc;
        }, {});

        const userAverages = Object.entries(userSpots).map(([userId, spotCount]) => ({
          userId,
          spotCount,
        }));

        // Calculer la moyenne globale
        const totalSpots = userAverages.reduce((sum, user) => sum + user.spotCount, 0);
        const globalAverage = userAverages.length > 0 ? totalSpots / userAverages.length : 0;

        setAnalysisData({
          userAverages,
          globalAverage,
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Nombre moyen de spots par utilisateur
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
                {analysisData.globalAverage.toFixed(2)}
              </span>
            </div>
            {/* <div className="space-y-2">
              {analysisData.userAverages.map(user => (
                <div key={user.userId} className="flex justify-between items-center">
                  <span>Utilisateur {user.userId}</span>
                  <span className="font-medium">
                    {user.spotCount} spots
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

export default SpotPerUser;
