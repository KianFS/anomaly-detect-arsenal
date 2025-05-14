
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Detection, FileStatus, SystemStatus } from '../types';
import { mockDetections, mockFileStatus, mockSystemStatus } from '../services/mockData';

interface AppContextType {
  detections: Detection[];
  fileStatus: FileStatus;
  systemStatus: SystemStatus;
  selectedDetection: Detection | null;
  isMonitoring: boolean;
  setSelectedDetection: (detection: Detection | null) => void;
  toggleMonitoring: () => void;
  dismissDetection: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [detections, setDetections] = useState<Detection[]>(mockDetections);
  const [fileStatus, setFileStatus] = useState<FileStatus>(mockFileStatus);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockSystemStatus);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const dismissDetection = (id: string) => {
    setDetections(detections.filter(detection => detection.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        detections,
        fileStatus,
        systemStatus,
        selectedDetection,
        isMonitoring,
        setSelectedDetection,
        toggleMonitoring,
        dismissDetection
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
