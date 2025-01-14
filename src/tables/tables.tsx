import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileCRUD from '../components/tables/profiles/profiles.tsx';
import BrandsCRUD from '../components/tables/brands/brands.tsx';
import ModelsCRUD from '../components/tables/models/models.tsx'

const Tables = () =>{
    return(
    <div className="p-4">
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profiles">CRUD Profiles</TabsTrigger>
            <TabsTrigger value="models">CRUD Modeles</TabsTrigger>
            <TabsTrigger value="brands">CRUD Marques</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <ProfileCRUD />
          </TabsContent>
  
          <TabsContent value="models">
            <ModelsCRUD />
          </TabsContent>

          <TabsContent value="brands">
            <BrandsCRUD />
          </TabsContent>
  
        </Tabs>
      </div>)
}
export default Tables