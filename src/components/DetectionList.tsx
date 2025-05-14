import { useApp } from "../contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const DetectionList = () => {
  const { detections } = useApp();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'MEDIUM':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'LOW':
        return 'bg-green-500 text-white hover:bg-green-600';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (detections.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No detections found. Run a scan to detect changes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {detections.map((detection, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{detection.path}</p>
              <p className="text-sm text-muted-foreground">
                {detection.type} - {new Date(detection.timestamp).toLocaleString()}
              </p>
            </div>
            <Badge className={`${getSeverityColor(detection.severity)}`}>
              {detection.severity}
            </Badge>
          </div>
          <div className="mt-2 text-sm">
            <p>Size: {detection.size} bytes</p>
            <p>Mode: {detection.mode}</p>
            <p className="font-mono text-xs mt-1">Hash: {detection.sha256}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DetectionList; 