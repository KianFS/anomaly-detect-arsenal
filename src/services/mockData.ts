
import { Detection, FileStatus, SystemStatus } from '../types';

export const mockDetections: Detection[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    path: '/usr/bin/services/',
    threat: 'Suspicious Binary Modification',
    description: 'A system binary was modified outside regular update channels',
    severity: 'high',
    isKnownPattern: true,
    affectedFiles: ['/usr/bin/services/svchost.exe'],
    recommendation: 'Isolate the system and restore the binary from a known good backup',
    details: {
      attackVector: 'File Tampering',
      technique: 'Binary Replacement',
      potentialImpact: 'Privilege Escalation, Persistent Access',
      indicators: ['Timestamp anomaly', 'Hash mismatch', 'Unauthorized modification']
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    path: '/home/user/downloads/',
    threat: 'Suspicious Script Execution',
    description: 'PowerShell script with obfuscated code attempted execution',
    severity: 'medium',
    isKnownPattern: true,
    affectedFiles: ['/home/user/downloads/invoice-details.ps1'],
    recommendation: 'Delete the file and scan the system for additional malware'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    path: '/var/www/html/',
    threat: 'Web Shell Detected',
    description: 'PHP file with command execution capabilities found in web directory',
    severity: 'critical',
    isKnownPattern: true,
    affectedFiles: ['/var/www/html/images/upload.php'],
    recommendation: 'Remove the file immediately and patch the web application'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    path: '/etc/cron.d/',
    threat: 'Unauthorized Scheduled Task',
    description: 'New cron job created with network connection capabilities',
    severity: 'high',
    isKnownPattern: false,
    affectedFiles: ['/etc/cron.d/system-update'],
    recommendation: 'Remove the task and investigate its origin'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    path: '/tmp/',
    threat: 'Anomalous File Creation Pattern',
    description: 'Multiple encrypted files created in temporary directory',
    severity: 'low',
    isKnownPattern: false,
    affectedFiles: ['/tmp/data001.enc', '/tmp/data002.enc'],
    recommendation: 'Monitor for ransomware activity and verify backups'
  }
];

export const mockFileStatus: FileStatus = {
  totalScanned: 287453,
  lastScan: new Date().toISOString(),
  filesMonitored: 154278,
  suspiciousFiles: 17,
  modifiedFiles: 342
};

export const mockSystemStatus: SystemStatus = {
  cpuUsage: 23,
  memoryUsage: 42,
  diskUsage: 68,
  lastUpdateTime: new Date().toISOString(),
  status: 'healthy'
};

// Helper functions to get detections by severity
export const getDetectionsBySeverity = (severity: string) => {
  return mockDetections.filter(detection => detection.severity === severity);
};

export const getDetectionCountBySeverity = () => {
  const counts = {
    low: getDetectionsBySeverity('low').length,
    medium: getDetectionsBySeverity('medium').length,
    high: getDetectionsBySeverity('high').length,
    critical: getDetectionsBySeverity('critical').length
  };
  
  return counts;
};
