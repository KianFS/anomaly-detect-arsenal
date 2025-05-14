import { useApp } from "../contexts/AppContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DetectionStats = () => {
  const { detections } = useApp();

  // Calculate counts for each severity level
  const stats = detections.reduce((acc, detection) => {
    acc[detection.severity] = (acc[detection.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'HIGH', value: stats.HIGH || 0, color: '#ef4444' },  // red-500
    { name: 'MEDIUM', value: stats.MEDIUM || 0, color: '#eab308' },  // yellow-500
    { name: 'LOW', value: stats.LOW || 0, color: '#22c55e' }  // green-500
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${((value / total) * 100).toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} detections`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="text-center">
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionStats; 