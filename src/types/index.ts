
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Detection {
  id: string;
  timestamp: string;
  path: string;
  threat: string;
  description: string;
  severity: SeverityLevel;
  isKnownPattern: boolean;
  affectedFiles: string[];
  recommendation: string;
  details?: {
    attackVector?: string;
    technique?: string;
    potentialImpact?: string;
    indicators?: string[];
  };
}

export interface FileStatus {
  totalScanned: number;
  lastScan: string;
  filesMonitored: number;
  suspiciousFiles: number;
  modifiedFiles: number;
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  lastUpdateTime: string;
  status: 'healthy' | 'warning' | 'critical';
}
