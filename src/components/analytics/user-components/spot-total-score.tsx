import { Card, CardContent } from '@/components/ui/card';
import { 
    Bar, ComposedChart, Line, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';


const SpotTotalScore = () => {
    const sampleData = [
        { name: 'Jan', spots: 20, score: 150 },
        { name: 'Feb', spots: 30, score: 200 },
        { name: 'Mar', spots: 25, score: 180 },
        { name: 'Apr', spots: 80, score: 140 }
      ];
    return (
        <Card className='w-fit'>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Spots & Score Total</h3>
                <ComposedChart width={400} height={300} data={sampleData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Bar dataKey="spots" fill="#8884d8" />
                  <Line type="monotone" dataKey="score" stroke="#ff7300" />
                </ComposedChart>
              </CardContent>
            </Card>
    );
};

export default SpotTotalScore;