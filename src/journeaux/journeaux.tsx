import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnalyzeLogsTable from '../components/journeaux/analyze-logs'
import AdMobLogsTable from '../components/journeaux/add-logs'


// Composant principal
const StatsDashboard = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="analyze">Analyze Logs</TabsTrigger>
          <TabsTrigger value="add">Adds Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze">
          <AnalyzeLogsTable />
        </TabsContent>

        <TabsContent value="add">
          <AdMobLogsTable />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default StatsDashboard;