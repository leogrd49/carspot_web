import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnalyzeLogsTable from '../components/journeaux/analyze-logs'
import AdMobLogsTable from '../components/journeaux/add-logs'

// Composant principal
const StatsDashboard = () => {
  return (
    <div className="p-2 sm:p-4">
      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="mb-4 flex flex-wrap justify-start gap-2 overflow-x-auto max-w-full">
          <TabsTrigger value="analyze" className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">Analyze Logs</TabsTrigger>
          <TabsTrigger value="add" className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">Adds Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="w-full overflow-x-auto">
          <AnalyzeLogsTable />
        </TabsContent>

        <TabsContent value="add" className="w-full overflow-x-auto">
          <AdMobLogsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsDashboard;
