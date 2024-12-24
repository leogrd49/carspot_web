import { Card, CardContent } from '@/components/ui/card';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    Scatter, ScatterChart,
  } from 'recharts';
const PrivilegedSchedules = () =>{
    return (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Horaires Privilégiés</h3>
            <ScatterChart width={400} height={300}>
              <CartesianGrid />
              <XAxis type="number" dataKey="hour" name="Heure" />
              <YAxis type="number" dataKey="day" name="Jour" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={[
                { hour: 8, day: 1, value: 100 },
                { hour: 12, day: 3, value: 150 },
                { hour: 16, day: 5, value: 200 }
              ]} fill="#8884d8" />
            </ScatterChart>
          </CardContent>
        </Card>
    )
};
export default PrivilegedSchedules;