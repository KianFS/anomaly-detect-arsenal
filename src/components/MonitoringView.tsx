
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'framer-motion';

// Simulated file system structure for visualization
const fileSystem = {
  system: {
    bin: ['core', 'services', 'utils'],
    lib: ['shared', 'extensions'],
    etc: ['config', 'cron.d', 'systemd']
  },
  home: {
    user: ['documents', 'downloads', 'desktop']
  },
  var: {
    www: ['html', 'logs', 'uploads'],
    log: ['system', 'security', 'application']
  }
};

const MonitoringView = () => {
  const { isMonitoring, detections } = useApp();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  // Map detections to their directory paths
  const detectionPaths = detections.reduce((paths, detection) => {
    const basePath = detection.path.split('/')[1]; // Get the first directory
    paths[basePath] = [...(paths[basePath] || []), detection];
    return paths;
  }, {} as Record<string, typeof detections>);
  
  if (!isMonitoring) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg border-muted">
        <div className="text-center">
          <h3 className="text-lg font-medium">Monitoring Paused</h3>
          <p className="text-sm text-muted-foreground mt-1">Start monitoring to view file system activity</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-4 h-80">
      {Object.entries(fileSystem).map(([dirName, subDirs]) => {
        const hasIssues = dirName in detectionPaths;
        const hasCritical = hasIssues && detectionPaths[dirName].some(d => d.severity === 'critical');
        
        return (
          <div 
            key={dirName}
            className={`relative border rounded-lg p-4 ${
              hasIssues ? 'border-security-medium' : 'border-muted'
            } ${
              hasCritical ? 'bg-security-critical bg-opacity-10' : ''
            }`}
            onMouseEnter={() => setHoveredPath(dirName)}
            onMouseLeave={() => setHoveredPath(null)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">/{dirName}/</h3>
              {hasIssues && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  hasCritical ? 'bg-security-critical' : 'bg-security-medium'
                } text-white`}>
                  {detectionPaths[dirName].length}
                </span>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              {Object.entries(subDirs).map(([subDir, files]) => (
                <div key={subDir} className="ml-4">
                  <div className="font-medium text-sm">{subDir}/</div>
                  <div className="ml-4 mt-1 grid grid-cols-2 gap-1">
                    {files.map(file => {
                      const filePath = `/${dirName}/${subDir}/${file}`;
                      const fileDetections = detections.filter(d => d.path.includes(filePath));
                      const hasFileIssue = fileDetections.length > 0;
                      
                      return (
                        <div 
                          key={file}
                          className={`text-xs py-1 px-2 rounded ${
                            hasFileIssue ? 'bg-security-medium bg-opacity-20 text-security-high' : 'text-muted-foreground'
                          }`}
                        >
                          {file}
                          {hasFileIssue && (
                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-security-high"></span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Simulated scanning activity */}
            {isMonitoring && hoveredPath === dirName && (
              <motion.div 
                className="absolute inset-0 bg-primary bg-opacity-10 rounded-lg pointer-events-none"
                animate={{ opacity: [0.2, 0.1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MonitoringView;
