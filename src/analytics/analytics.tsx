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
            <TabsTrigger value="brand">Statistiques Marque</TabsTrigger>
            <TabsTrigger value="community">Statistiques Communautaires</TabsTrigger>
          </TabsList>
  
          <TabsContent value="user">
            <UserStats />
          </TabsContent>
  
          <TabsContent value="car">
            <CarStats />
          </TabsContent>
  
          <TabsContent value="brand">
            <div className="text-center p-4">
              Contenu des statistiques marque à implémenter
            </div>
          </TabsContent>
  
          <TabsContent value="community">
            <div className="text-center p-4">
              Contenu des statistiques communautaires à implémenter
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  export default StatsDashboard;