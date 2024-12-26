import { Card, CardContent } from '@/components/ui/card';
  import { Tooltip,RadialBarChart, RadialBar} from 'recharts';


const RatioSuperspot = () => {
    return (
        <Card className='w-fit'>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Ratio Superspots</h3>
            <RadialBarChart 
              width={400} 
              height={300} 
              innerRadius="60%" 
              outerRadius="80%" 
              data={[{ name: 'Ratio', value: 70 }]}
            >
              <RadialBar dataKey="value" fill="#8884d8" />
              <Tooltip />
            </RadialBarChart>
          </CardContent>
        </Card>
    );
};

export default RatioSuperspot;