  import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
  import UserStats from '../components/analytics/user-components/user-components.tsx'
  import CarStats from '../components/analytics/car-components/car-components.tsx'

  
  // Composant principal
  const StatsDashboard = () => {
    return (
      <div className="p-4">
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="user">Statistiques Utilisateur</TabsTrigger>
            <TabsTrigger value="car">Statistiques Voiture</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <UserStats />
          </TabsContent>
  
          <TabsContent value="car">
            <CarStats />
          </TabsContent>
  
        </Tabs>
      </div>
    );
  };
  
  export default StatsDashboard;