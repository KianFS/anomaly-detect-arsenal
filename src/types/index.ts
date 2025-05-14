export interface Detection {
  path: string;
  type: 'ADDED' | 'MODIFIED' | 'DELETED';
  timestamp: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  size: number;
  mtime: number;
  mode: string;
  sha256: string;
}

export interface FileStatus {
  isMonitoring: boolean;
  baselinePath: string;
  lastScan: string;
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  lastUpdateTime: string;
  status: 'healthy' | 'warning' | 'critical';
}

declare module "@/components/ui/badge" {
  export const Badge: React.FC<{
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning';
    children: React.ReactNode;
  }>;
}
