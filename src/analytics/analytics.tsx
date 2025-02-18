import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserStats from '../components/analytics/user-components/user-components.tsx';
import CarStats from '../components/analytics/car-components/car-components.tsx';

const StatsDashboard = () => {
  return (
    <div className="p-2 sm:p-4 w-full max-w-5xl mx-auto flex flex-col items-center">
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-4 flex flex-wrap justify-center gap-2 w-full max-w-full">
          <TabsTrigger value="user" className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base">Statistiques Utilisateur</TabsTrigger>
          <TabsTrigger value="car" className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base">Statistiques Voiture</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="w-full flex flex-col items-center px-2 sm:px-0">
          <UserStats />
        </TabsContent>

        <TabsContent value="car" className="w-full flex flex-col items-center px-2 sm:px-0">
          <CarStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsDashboard;
