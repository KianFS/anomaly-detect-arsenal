import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DetectionTimeline = () => {
  const { detections, fileStatus, baselineFiles } = useApp();

  const processTimelineData = () => {
    const timeMap = new Map<string, { total: number; detected: number }>();
    
    // Process baseline files
    baselineFiles.forEach(file => {
      const date = new Date(file.mtime * 1000); // Convert Unix timestamp to JS Date
      const timeKey = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      const existing = timeMap.get(timeKey) || { total: 0, detected: 0 };
      timeMap.set(timeKey, {
        ...existing,
        total: existing.total + 1
      });
    });

    // Process detections
    detections.forEach(detection => {
      const date = new Date(detection.timestamp);
      const timeKey = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      const existing = timeMap.get(timeKey) || { total: 0, detected: 0 };
      timeMap.set(timeKey, {
        ...existing,
        detected: existing.detected + 1
      });
    });

    // Convert map to sorted array
    return Array.from(timeMap.entries())
      .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
      .map(([time, counts]) => ({
        time,
        'All Files': counts.total,
        'Detected Changes': counts.detected
      }));
  };

  const timelineData = processTimelineData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white'
                }}
                labelStyle={{ color: 'white' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="All Files"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorTotal)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="Detected Changes"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorDetected)"
                stackId="2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionTimeline; 