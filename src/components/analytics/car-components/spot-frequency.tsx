import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, 
} from 'recharts';
const SpotFrequency = () =>{
    const timeData = [
        { month: 'Jan', spots: 65 },
        { month: 'Feb', spots: 85 },
        { month: 'Mar', spots: 45 }
      ];

    return (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Fréquence Spots</h3>
            <BarChart width={400} height={300} data={timeData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="spots" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>
    )
}
export default SpotFrequency;