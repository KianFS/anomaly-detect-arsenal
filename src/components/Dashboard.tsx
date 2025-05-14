import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database, FileSearch, Info, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MonitoringView from "./MonitoringView";
import { getDetectionCountBySeverity } from "../services/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

// Mock data for the timeline chart
const timelineData = [
  { time: '00:00', detections: 1 },
  { time: '04:00', detections: 3 },
  { time: '08:00', detections: 2 },
  { time: '12:00', detections: 5 },
  { time: '16:00', detections: 8 },
  { time: '20:00', detections: 4 },
  { time: '24:00', detections: 3 },
];

const Dashboard = () => {
  const { systemStatus, fileStatus, isMonitoring, toggleMonitoring, detections } = useApp();
  const detectionCounts = getDetectionCountBySeverity();
  
  const getSystemStatusIcon = () => {
    switch(systemStatus.status) {
      case 'healthy':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-security-medium" />;
      case 'critical':
        return <ShieldX className="h-5 w-5 text-security-critical" />;
      default:
        return <Shield className="h-5 w-5 text-primary" />;
    }
  };
  
  const getStatusColor = () => {
    switch(systemStatus.status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-security-medium';
      case 'critical': return 'bg-security-critical';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your file system for suspicious activities</p>
        </div>
        <Button 
          variant={isMonitoring ? "destructive" : "default"}
          onClick={toggleMonitoring}
        >
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {getSystemStatusIcon()}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <div className="text-2xl font-bold capitalize">{systemStatus.status}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {new Date(systemStatus.lastUpdateTime).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Monitored</CardTitle>
            <FileSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStatus.filesMonitored.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fileStatus.totalScanned.toLocaleString()} total files scanned
            </p>
            <p className="text-xs text-muted-foreground">
              Last scan: {new Date(fileStatus.lastScan).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Files</CardTitle>
            <AlertTriangle className="h-4 w-4 text-security-high" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStatus.suspiciousFiles}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {fileStatus.modifiedFiles} files modified today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <ShieldX className="h-4 w-4 text-security-critical" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detectionCounts.critical}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {detectionCounts.high} high severity issues detected
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Detection Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="detections" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorDetections)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">CPU Usage</div>
                <div className="text-sm text-muted-foreground">{systemStatus.cpuUsage}%</div>
              </div>
              <Progress value={systemStatus.cpuUsage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Memory Usage</div>
                <div className="text-sm text-muted-foreground">{systemStatus.memoryUsage}%</div>
              </div>
              <Progress value={systemStatus.memoryUsage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Disk Usage</div>
                <div className="text-sm text-muted-foreground">{systemStatus.diskUsage}%</div>
              </div>
              <Progress value={systemStatus.diskUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>File System Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <MonitoringView />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Detections</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/details">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detections.slice(0, 3).map(detection => (
              <div key={detection.id} className="flex items-start justify-between border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{detection.threat}</h4>
                    <Badge className={`severity-${detection.severity} severity-badge`}>
                      {detection.severity}
                    </Badge>
                    {detection.isKnownPattern ? (
                      <Badge variant="outline" className="text-xs">Known Pattern</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Anomaly</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{detection.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(detection.timestamp).toLocaleString()} • {detection.path}
                  </p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/details/${detection.id}`}>
                    <Info className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
