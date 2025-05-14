import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DetectionList from "./DetectionList";
import { useState } from "react";

const Dashboard = () => {
  const { 
    isMonitoring, 
    toggleMonitoring, 
    createNewBaseline,
    performScan,
    detections 
  } = useApp();

  // Local state for the directory path input
  const [directoryPath, setDirectoryPath] = useState('');

  // Handle baseline creation
  const handleCreateBaseline = async () => {
    if (!directoryPath.trim()) {
      alert('Please enter a directory path');
      return;
    }
    try {
      await createNewBaseline(directoryPath);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Handle scanning
  const handleScan = async () => {
    if (!directoryPath.trim()) {
      alert('Please enter a directory path');
      return;
    }
    try {
      await performScan(directoryPath);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File System Monitor</h1>
          <p className="text-muted-foreground">Monitor your file system for suspicious activities</p>
        </div>
        <Button 
          variant={isMonitoring ? "destructive" : "default"}
          onClick={toggleMonitoring}
        >
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monitor Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="/path/to/directory" 
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateBaseline}>Create Baseline</Button>
            <Button onClick={handleScan}>Scan Directory</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detections</CardTitle>
          <Badge variant="outline">{detections.length} found</Badge>
        </CardHeader>
        <CardContent>
          <DetectionList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
